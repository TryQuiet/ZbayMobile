export type IPublicChannel = {
  name: string;
  description: string;
  owner: string;
  timestamp: number;
  address: string;
  keys: {ivk?: string; sk?: string};
};

export type IPublicChannelMessage = {
  id: string;
  type: number;
  typeIndicator: number;
  message: string;
  createdAt: number;
  r: number;
  channelId: string;
  signature: string;
};
