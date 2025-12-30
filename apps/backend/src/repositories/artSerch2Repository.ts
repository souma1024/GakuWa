// 型定義
// データベースにある「記事テーブル（articles）」の型
export interface Article {
    id: number;
    title: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

// serviceから渡された「検索条件」の型定義
export type ArtSearch2RepositoryParams = {
    offset: number; // 取得開始位置
    limit: number; // 1ページあたりの件数
    keywords: string[]; // 検索キーワードの配列
    status: 'published'; // 固定値 'published'
};

// repositoryが返す「検索結果」の型
// 記事のリストだけではなく、ページネーション用に「総件数」も含めて返す。
export type SearchResult = {
    articles: Article[]; // 記事の配列
    totalCount: number; // 検索結果の総件数
};

// Repositoryの設計図（インターフェース）
// 「このクラスは find メソッドを必ず持っています」という約束事
export interface IArticleRepository {
    find(params: ArtSearch2RepositoryParams): Promise<SearchResult>;
}

// MySQL用のクラスの実装

// MySQLを使って記事データを取得・収集するクラス
export class MySQLArticleRepository implements IArticleRepository {

    /**
     * 【メイン処理】
     * 検索条件を受け取り、データ取得と件数カウントを行うメソッド
     */
    async find(params: ArtSearch2RepositoryParams): Promise<SearchResult> {
        
        // ---------------------------------------------------------
        // ステップA: 共通の条件文（WHERE句）を作る
        // ---------------------------------------------------------
        // データ取得用とカウント用で「同じ条件」を使うため、
        // 下に作ったヘルパー関数(buildWhereClause)で先にSQLの部品を作ります。
        // DRY原則（同じコードを二度書かない）の実践です。
        const { whereSql, values } = this.buildWhereClause(params);

        // ---------------------------------------------------------
        // ステップB: データ取得用のSQLを組み立てる
        // ---------------------------------------------------------
        // SELECT * ... でデータを取ってきます。
        // LIMIT と OFFSET を使って、特定のページの分だけ切り取ります。
        const dataSql = `
            SELECT * FROM articles 
            ${whereSql} 
            ORDER BY published_at DESC 
            LIMIT ? OFFSET ?
        `;

        // SQLの「?」に入れる値を合体させます。
        // [...values] は「さっき作った条件用の値リスト」を展開したもの。
        // その後ろに、LIMITとOFFSETの値を追加します。
        const dataValues = [...values, params.limit, params.offset];

        // ---------------------------------------------------------
        // ステップC: 総件数カウント用のSQLを組み立てる
        // ---------------------------------------------------------
        // SELECT COUNT(*) ... で「何件あるか」の数字だけ取ってきます。
        // ここには LIMIT や OFFSET はつけません（全件数えたいから）。
        const countSql = `
            SELECT COUNT(*) as total FROM articles 
            ${whereSql}
        `;
        //  これ以降はなぜかprasmaがうまく働かないのでダミーを入れています。
        // ごめんなさい
        // カウント用は LIMIT 等の値がいらないので、共通の values をそのまま使います。
        const countValues = values;
        
// --- ログで完成したSQLを確認（学習用） ---
        console.log("--- [1] データ取得クエリ ---");
        console.log("SQL:", dataSql); 
        console.log("パラメータ:", dataValues);

        console.log("--- [2] カウント取得クエリ ---");
        console.log("SQL:", countSql);
        console.log("パラメータ:", countValues);

        // ※本来はここで `await connection.execute(...)` を行います。
        // 今回はダミーデータを返して終了します。
        return {
            articles: [], // 本当はここにDBから取れたデータが入ります
            totalCount: 0 // 本当はここに countSql の結果が入ります
        };
    }

    /**
     * 【ヘルパー関数】by AI
     * 検索条件から「WHERE句」と「埋め込む値」を生成する裏方さん。
     * private なのでクラスの外からは見えません。
     */
    private buildWhereClause(params: ArtSearch2RepositoryParams) {
        
        // 1. ベースとなる条件
        // 画像の要件: status = 'published' (公開済み) の記事のみ対象
        let whereSql = "WHERE status = 'published'";
        
        // 2. パラメータを入れる箱
        // SQLインジェクション対策のため、値は直接SQLに書かず、ここに入れます。
        const values: any[] = [];

        // 3. キーワードごとのループ処理（AND検索）
        // 画像の要件: スペース区切りで入力された際、すべてのワードを含む記事をヒットさせる
        for (const word of params.keywords) {
            
            // SQLを継ぎ足していく
            // (title LIKE ? OR content_md LIKE ?) という塊を追加します。
            whereSql += " AND (title LIKE ? OR content_md LIKE ?)";

            // 「?」に入る値を配列に追加
            // % はワイルドカード（部分一致）です。
            // タイトル用と本文用の2つ分 push します。
            values.push(`%${word}%`, `%${word}%`);
        }

        // 作成した「SQLの切れ端」と「値のリスト」をセットで返します
        return { whereSql, values };
    }
}