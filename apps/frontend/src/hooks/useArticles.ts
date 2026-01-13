import { useEffect, useState } from "react"

export type Article = {
  title: string,
  author: string,
  author_avatarUrl: string,
  likes_count: string,
  tag_names: string[],
  updated_at: string | null
}

const init = [{
  title: "デフォルト",
  author: "デフォルト",
  author_avatarUrl: "/api/images/avatars/default_avatar.png",
  likes_count: "0",
  tag_names: [],
  updated_at: (new Date()).toLocaleDateString()
}];

export const useArticles = () : Article[] => {
  const [articles, setArticles] = useState<Article[]>(init);

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

  useEffect(() => {
    fetchArticles();
  }, []);

  return articles;
}