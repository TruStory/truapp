
export interface Community {
  id: string;
  name: string;
  iconImage: CommunityIconImage;
  following?: boolean;
  description?: string;
  heroImage: string;
}

export interface CommunityIconImage {
  regular: string;
  active: string;
}

export enum FeedFilters {
  NONE=0,
  TRENDING=1,
  LATEST=2,
  BEST=4,
}

export interface FeedFilter {
  id: FeedFilters;
  name: string;
}
