import { useState } from "react"

export type PublishedArticle = {
  handle: string,
  title: string,
  author: string,
  author_avatarUrl: string,
  likes_count: string,
  tag_names: string[],
  updated_at: string | null
}

export type Article = PublishedArticle & {
  status: string;
}

export const useArticles = () => {
  const [publishedArticles, setPublishedArticles] = useState<PublishedArticle[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchPublishedArticles = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/articles', {
        method: 'GET'
      });
      const result = await res.json();
      setPublishedArticles(result.data);
      console.log(result.data);
    } catch (e) {
      console.log(e);
    }
  }

  const fetchPublishedUsersArticles = async (handle: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/${handle}/articles`, {
        method: 'GET'
      });
      const result = await res.json();
      setPublishedArticles(result.data);
    } catch (e) {
      console.log(e);
    }
  }

  const fetchUsersArticles = async (handle: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/${handle}/articles?t=all`, {
        method: 'GET'
      });
      const result = await res.json();
      console.log("fetchUsersArticle: ", result);
      setArticles(result.data);
    } catch (e) {
      console.log(e);
    }
  }

  return { 
    articles,
    fetchUsersArticles,
    publishedArticles, 
    fetchPublishedArticles, 
    fetchPublishedUsersArticles 
  };
}