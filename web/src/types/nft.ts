// DB MERGED NFT
export interface NFT {
  id: string;
  cid: string;
  name: string;
  description?: string;
  image: string;
  price: string;
  isActive: boolean;
  createdAt: string;
  attributes?: {
    trait_type: string;
    value: string | number;
  }[];
}

export interface NFTMetadata {
  name: string;
  description?: string;
  image: string;
  price: string;
  isActive: boolean;
  attributes?: {
    trait_type: string;
    value: string | number;
  }[];
}
