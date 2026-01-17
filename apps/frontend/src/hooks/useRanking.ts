import { useState } from "react";


export type postsRanking = {
  handle: string;
  avatar_url: string;
  posts_count: string;
}


export const useRanking = () => {
  const [postsRanking, setPosts] = useState<postsRanking[]>([]);

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

  return { postsRanking, fetchPosts };
}