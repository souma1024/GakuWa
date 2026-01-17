import { Posts } from "../dtos/rankings/postsRanking";
import { rankingRepositoy } from "../repositories/rankingRepository"


export const rankingService = {
  async postsArticle(): Promise<Posts[]> {
    const data = await rankingRepositoy.postsRanking();

    const ranking: Posts[] = data.map(item => ({
      handle: item.handle,
      avatar_url: item.avatarUrl,
      posts_count: item._count.articles.toString(),
    }));

    return ranking;
  }
}