import { BaseClaim, Claim, FeedClaim } from 'shared/types/claim';

export const isLiveVideo = (claim: Claim | BaseClaim | FeedClaim) => {
  return claim.video !== null && claim.video.includes('youtube.com/embed');
};

export const isHostedVideo = (claim: Claim | BaseClaim | FeedClaim) => {
  return claim.video !== null && claim.video.includes('jwplatform.com');
};

export const isVideo = (claim: Claim | BaseClaim | FeedClaim): boolean => {
  return (isHostedVideo(claim) || isLiveVideo(claim));
};
