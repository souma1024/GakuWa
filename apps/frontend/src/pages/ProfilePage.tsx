import { useLocation, useOutletContext } from "react-router-dom";

import ProfileCard from "../components/ProfileCard";
import ProfileEdit from "../components/ProfileEdit";
import ArticleCard from "../components/ArticleCard";

import { useArticles } from "../hooks/useArticles";

import styles from "../styles/profile.module.css";
import { useEffect, useState, useMemo } from "react";
import { User } from "../type/user";

export default function ProfilePage() {
  const { user } = useOutletContext<{ user: User | null }>();
  const location = useLocation();

  const mode = useMemo(
    () => new URLSearchParams(location.search).get("mode"),
    [location.search]
  );

  const handle = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[0] ?? "";
  }, [location.pathname]);

  const [publicUser, setPublicUser] = useState<User | null>();
  const [isOneSelf, setIsOneSelf] = useState(false);

  const { publishedArticles, fetchPublishedUsersArticles } = useArticles();
  const isArticles = publishedArticles.length > 0;
  
   useEffect(() => {
    if (!handle) return;
    fetchPublishedUsersArticles(handle);
  }, [handle]);

  useEffect(() => {
    if (!handle) return;
    const fetchOneSelf = async () => {
      const res = await fetch('http://localhost:8080/api/auth/oneself', {
        method: "POST",
        credentials: "include"
      });

      if (!res.ok) {
        setIsOneSelf(false);
        return;
      }

      const result = await res.json();
      setIsOneSelf(result.data === handle);
    };

    const fetchHandleData = async (handle: string) => {
      const res = await fetch(`http://localhost:8080/api/profile/${handle}`, {
        method: "GET"
      });

      if (!res.ok) {
        setPublicUser(null);
        return;
      }

      const result = await res.json();
      const fetchedUser: User = result.data;
      if (user?.handle && fetchedUser.handle === user.handle) {
        setPublicUser(null);
      } else {
        setPublicUser(fetchedUser);
      }
    };
    fetchOneSelf();
    fetchHandleData(handle);
  }, [location.pathname]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {mode ? (
        <ProfileEdit user={user}/>
      ) : (
        <div className={ styles.wrapper }>
          <div className={ styles.lefter}>
            <div className={ styles.fixed }>
              <ProfileCard user={publicUser ?? user} userOneself={isOneSelf} />
            </div>
          </div>
          
          <div className={ styles.righter }>
            {
              publishedArticles.map((article, _) => (
                <ArticleCard key={ article.handle } article={ article }/>
              ))
            }
            {!isArticles && !publicUser && <p>記事を作成して公開しよう</p>}
            {!isArticles && publicUser && <p>公開中の記事がありません</p>}
          </div>
        </div>
      )}
    </div>
  );
}