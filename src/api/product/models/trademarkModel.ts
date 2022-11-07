//单个品牌
export interface TrademarkItem {
  id: number;
  tmName: string;
  logoUrl: string;
}

//品牌列表
export type TrademarkList = TrademarkItem[];

// 品牌列表数据类型
export interface GetTrademarkListApiResponse {
  records: TrademarkList;
  total: number;
}
