import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { User } from "../components/ProfileCard";

export type OutletContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function BlockPage() {
  const [user, setUser] = useState<User | null>(null);
  

  useEffect(() => {
    const check = async () => {
      try {

        const response = await fetch("http://localhost:8080/api/auth/session", {
          method: "POST",
          credentials: "include",
        });
        const result = await response.json();

        if (result.success) {
          history.replaceState(result.data, "", "/" + result.data.handle)
          setUser(result.data)
        } 
        console.log("BlockPageに到達したよ");
      } catch(e) {
        console.log(e);
      }
    };

    check();
  }, []);

  return <Outlet context={{ user, setUser }}/>;
}