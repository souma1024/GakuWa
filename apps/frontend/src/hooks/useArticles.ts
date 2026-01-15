import { useState } from "react"

export type Article = {
  handle: string,
  title: string,
  author: string,
  author_avatarUrl: string,
  likes_count: string,
  tag_names: string[],
  updated_at: string | null
}

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/articles', {
        method: 'GET'
      });
      const result = await res.json();
      setArticles(result.data);
      console.log(result.data);
    } catch (e) {
      console.log(e);
    }
  }

  const fetchUsersArticles = async (handle: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/${handle}/articles`, {
        method: 'GET'
      });
      const result = await res.json();
      setArticles(result.data);
    } catch (e) {
      console.log(e);
    }
  }

  return { articles, fetchArticles, fetchUsersArticles };
}