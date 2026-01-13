import { useEffect, useState } from "react";


export type postsRanking = {
  handle: string;
  avatar_url: string;
  posts_count: string;
}

const init: postsRanking[] = [{handle: "default", avatar_url: '/api/images/avatars/default_avatar.png', posts_count: "0"}];

export const useRanking = () :postsRanking[] => {
  const [posts, setPosts] = useState<postsRanking[]>(init);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/ranking', {
        method: 'GET'
      });
      
      const result = await res.json();
      setPosts(result.data);
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return posts;
}