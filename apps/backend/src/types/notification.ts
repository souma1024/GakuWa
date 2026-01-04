// バッチ実行リクエストの型定義
export interface BatchNotifyRequest {
  target_date?: string; // "YYYY-MM-DD" 指定がない場合はサーバー時刻
  execute_mode: 'all' | 'reminder' | 'start';
}

// 処理結果レスポンスの型定義
export interface BatchNotifyResponse {
  status: string;
  executed_at: string;
  results: {
    reminder_sent_count: number;
    start_sent_count: number;
    errors: string[];
  };
}