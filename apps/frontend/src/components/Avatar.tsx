import { useNavigate } from "react-router-dom";

type User = {
  handle: string;
  name: string;
  avatarUrl: string;
  profile: string | null;
  followersCount: number;
  followingsCount: number;
}

type Props = {
  src: string;
  user: User;
};


export default function Avatar({ src, user }: Props) {

  const url: string = '/api/images/avatars/' + src;
  const navigate = useNavigate();

  return (
    <>
      <img src={url} alt="avatar" onClick={() => navigate(`/${user.handle}/profile`, {state: user})} style={{
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        marginRight: "20px",
        border: "1px solid blue",
        cursor: "pointer",
      }} />
    </>
  );
}