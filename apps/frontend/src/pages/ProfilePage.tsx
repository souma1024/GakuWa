import { useLocation, Outlet, useOutletContext } from "react-router-dom";

import ProfileCard from "../components/ProfileCard";
import ProfileEdit from "../components/ProfileEdit";

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
  

  if (!user) return <div>Loading...</div>;

  const onSaved = (updatedUser: User) => {
    setUser(updatedUser); 
    
  };

  return (
    <div>
      {mode ? (
        <ProfileEdit user={user} onSaved={onSaved} />
      ) : (
        <ProfileCard user={user} />
      )}
    </div>
  );
}