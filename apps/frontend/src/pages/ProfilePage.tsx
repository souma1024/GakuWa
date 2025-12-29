import { useLocation } from "react-router-dom";

import ProfileCard from "../components/ProfileCard";

export default function ProfilePage() {
  const location = useLocation();
  const user = location.state;

  return (
    <div>
      <ProfileCard user={ user }/>

      
    </div>
  );
}