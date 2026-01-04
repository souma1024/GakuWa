export type CreateArticleResponse = {
  id: string,
  title: string,
  status: string,
  createdAt: Date
}

export type GetArticlesResponse = CreateArticleResponse;

export type GetArticleResponse = CreateArticleResponse & {
  content: string,
  updatedAt: Date
}