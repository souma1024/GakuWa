import { useLocation, useOutletContext } from "react-router-dom";

import ProfileCard from "../components/ProfileCard";
import ProfileEdit from "../components/ProfileEdit";
import ArticleCard from "../components/ArticleCard";

import { useArticles } from "../hooks/useArticles";

import styles from "../styles/profile.module.css";
import { useEffect } from "react";

type User = {
  handle: string;
  name: string;
  avatarUrl: string;
  profile: string | null;
  followersCount: number;
  followingsCount: number;
};

type OutletContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function ProfilePage() {
  const { user, setUser } = useOutletContext<OutletContext>();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode');
  const { articles, fetchUsersArticles } = useArticles();

  useEffect(() => {
    if (!user)  return;
    fetchUsersArticles(user.handle);
  }, [user?.handle])

  if (!user) return <div>Loading...</div>;

  const onSaved = (updatedUser: User) => {
    setUser(updatedUser); 
    
  };

  return (
    <div>
      {mode ? (
        <ProfileEdit user={user} onSaved={onSaved} />
      ) : (
        <div className={ styles.wrapper }>
          <div className={ styles.lefter}>
            <div className={ styles.fixed }>
              <ProfileCard user={user} />
            </div>
            
          </div>
          
          <div className={ styles.righter }>    
            {
              articles.map((article, _) => (
                <ArticleCard key={ article.handle } article={ article }/>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}