// ファイル名に合わせてインポートパスを確認してください
import { 
    PrismaArticleRepository, 
    SearchResult,
    ArtSearch2RepositoryParams 
} from '../repositories/artSerch2Repository';

// Controllerから渡される「検索条件」の型定義
export type ArtSearch2Params = {
    page: number;
    limit: number;
    keyword?: string;
};

// ------ Serviceクラスの実装 -------

export class ArticleService {
    
    // Repositoryをクラスのプロパティとして定義
    private articleRepository: PrismaArticleRepository;

    constructor() {
        // インスタンス化
        this.articleRepository = new PrismaArticleRepository();
    }

    /**
     * メインの検索メソッド
     */
    async search(options: ArtSearch2Params): Promise<SearchResult> {
        
        // 1. キーワードの分解
        const words: string[] = this.parseSearchKeyword(options.keyword);

        // 2. ページネーション計算
        const offset: number = this.calculateOffset(options.page, options.limit);

        // 3. Repository用の条件作成
        const params: ArtSearch2RepositoryParams = {
            limit: options.limit,
            offset: offset,
            keywords: words,
            status: 'published'
        };

        // 4. Repositoryを呼び出す
        // ★修正ポイント: this.ArtSearch2Repository ではなく this.articleRepository を使います
        const result = await this.articleRepository.find(params);

        return result;
    }

    // --- プライベートメソッド ---

    private calculateOffset(page: number, limit: number): number {
        if (page < 1) { return 0; }
        return (page - 1) * limit;
    }

    private parseSearchKeyword(rawKeyword?: string): string[] {
        if (!rawKeyword) { return []; }
        return rawKeyword.trim().split(/\s+/).filter(word => word !== "");
    }
}