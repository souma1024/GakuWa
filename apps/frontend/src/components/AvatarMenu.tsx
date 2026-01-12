import { Menu } from './Menu'; 
import { useEffect, useRef, useState } from "react";

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


export default function AvatarMenu({ src, user }: Props) {

  const url: string = '/api/images/avatars/' + src;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }}>
      <img 
        src={url} 
        alt="avatar" 
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }} 
        style={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          marginRight: "20px",
          border: "1px solid blue",
          cursor: "pointer",
      }} />
      
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 1000,
            background: "white",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            padding: 8,
            minWidth: 220,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Menu user={user} src={src} />
        </div>
      )}
    </div>
  );
}