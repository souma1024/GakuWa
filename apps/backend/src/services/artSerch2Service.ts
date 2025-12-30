// step0----- ArtSerch2Service用のユーティリティ関数群 -----

//controllerから渡される「検索条件」の型定義
export type ArtSearch2Params = {
    page: number; // ページ番号
    limit: number; // 1ページあたりの件数
    keyword?: string; // 検索キーワード（省略可能）
};
//repository(データベース系)に渡す「検索条件」の型定義
// serviceが計算した結果をここに詰めて渡す
export type ArtSearch2RepositoryParams = {
    offset: number; // 取得開始位置
    limit: number; // 1ページあたりの件数
    keywords: string[]; // 検索キーワードの配列
    status: 'published'; // 固定値 'published'
};

//------serviceクラスの実装-------
/**
 * 記事検索のビジネスロジックを担当するクラスです。
 * データの計算や加工を行い、データベース係（Repository）に指示を出します。
 */
class ArticleService {
    
    // クラスの中で使う関数（メソッド）を定義します。
    // async (非同期) とは: 「DBへのアクセスは時間がかかるから、終わるのを待ってね」という印です。
    // Promise<...> は将来的に返ってくるデータの型を表します。
    async search(options: ArtSearch2Params): Promise<ArtSearch2RepositoryParams> {
        
        // 1. キーワードの分解処理（ステップ3のロジック）
        // クラス内の private メソッド（下で定義）を使います。
        // this. は「このクラスの」という意味です。
        const words: string[] = this.parseSearchKeyword(options.keyword);

        // 2. ページネーションの計算（ステップ2のロジック）
        // limit と page を使って offset を算出します。
        const offset: number = this.calculateOffset(options.page, options.limit);

        // 3. 検索条件の組み立て（画像の「実装内容」の核心）
        // ここで、Repositoryに渡すための命令書を作ります。
        const params: ArtSearch2RepositoryParams = {
            limit: options.limit,
            offset: offset,
            keywords: words,
            status: 'published' // 画像の要件: 公開済み(status = 'published')のみ対象
        };

        // 4. Repository（データベース係）を呼び出す
        // ※本当はここでRepositoryに params を渡してデータを取ってきます。
        // 今はまだRepositoryがないので、コンソールに「命令書」を表示して確認します。
        console.log("データベースへの命令を作成しました:", params);

        // ここで本来は検索結果を返します
        return params;
    }


//  step1----- ページネーションと件数取得----
/*
const 関数名　＝ (引数1: 型, 引数2: 型): 戻り値の型 => {
    処理内容
    return 戻り値
}
*/

    private calculateOffset = (page: number,limit:number): number =>{
        // バリデーションチェック
        // 1ページ未満の場合は0を返す
        if (page < 1){return 0;}
        // オフセット計算
        // (ページ番号 - 1) * 1ページあたりの件数
        // 例: 2ページ目で1ページあたり10件の場合、(2 - 1) * 10 = 10
        return (page - 1) * limit;
    }

// step2----- 検索キーワードの処理 -----
/*
ユーザーが入力した生の検索文字列を、単語ごとのリスト（配列）に変更する関数。
    今回の引数は rawKeyword で、型は string または undefined（省略可能）。
    戻り値の型は string の配列（string[]）です。
これは「文字列の入ったリスト（配列）」という意味の型。
*/ 
    private parseSearchKeyword = (rawKeyword?: string): string[] => {
        // もし検索ワードが空っぽ(undefined)なら、空っぽの配列[]を返す。
        if (!rawKeyword) {return [];}

        //　トリムと分解
        // 流れ　
        // "  C言語   ポインタ  " (入力)
        //    ↓ .trim()
        // "C言語   ポインタ" (前後の空白が消える)
        //    ↓ .split(...)
        // ["C言語", "ポインタ"] (間の空白で区切る)
        /*const words = rawKeyword
            .trim() // 文字列の前後の空白を取り除く
            .split(/\s+/); // 空白文字（スペース、タブ、改行など）で分割して配列にする

        return words.filter(word => word !== ""); //念のため 空文字を取り除く*/

        return rawKeyword.trim().split(/\s+/).filter(word => word !== "");
    }
}
