import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User } from "../components/ProfileCard";

export type OutletContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function BlockPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/session", {
          method: "POST",
          credentials: "include",
        });
        const result = await response.json();

        if (result.success) {
          setUser(result.data);

          const handle = result.data.handle;
          const path = window.location.pathname;

          const m = path.match(/^\/([^\/]+)(\/.*)?$/);
          const pathHandle = m?.[1];

          const isUserArea = pathHandle === handle; // 自分のhandle配下だけ許可

          if (isUserArea) return;

          navigate(`/${handle}`, { state: user});
        } 
      } catch(e) {
        console.log(e);
      }
    };

    check();
  }, []);

  return <Outlet context={{ user, setUser }}/>;
}