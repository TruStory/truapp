import { ID } from 'shared/types';
import { Coin } from 'shared/types/currency';
import { Time } from 'shared/types/date';
import { SlashArgumentReason, SlashType } from 'shared/types/slashing';
import { StakeType } from 'shared/types/stake';
import { UserMeta, UserProfile } from '../types/appAccount';

export type Hex = string;

export interface RegistrationRequest {
  authToken: string;
  authTokenSecret: string;
}

export enum DisplayUnit {
  PREETHI='preethi',
  SHANEV='shanev',
}

export const MsgConcreteTypes: { [key: string]: string }= {
  'MsgSubmitUpvote': 'truchain/MsgUpvoteArgument',
  'MsgSubmitArgument': 'truchain/MsgSubmitArgument',
  'MsgEditArgument': 'truchain/MsgEditArgument',
  'MsgSlashArgument': 'truchain/MsgSlashArgument',
  'MsgCreateClaim': 'truchain/MsgCreateClaim',
  'MsgEditClaim': 'truchain/MsgEditClaim',
};

export interface Fee {
  amount: Coin[];
  gas: number;
}

export interface Tx {
  account_number: number;
  chain_id: string;
  fee: Fee;
  memo: string;
  msgs: { [key: string]: any }[];
  sequence: number;
}

export interface UnsignedTx {
  msg_types: string[];
  tx: string;
  tx_raw: string;
}

export interface SignedTx {
  tx: string;
  msg_types: string[];
  pubkey: Hex;
  pubkey_algo: string;
  signature: Hex;
}

export interface Msg {
  type: string;
  body: object;
}

export interface MsgErrorWithLog {
  msg_index: number;
  success: boolean;
  log: string;
}

export interface MsgError {
  codespace: string;
  code: number;
  message: string;
}

export interface CreateClaim {
  body: string;
  communityId: string;
  source?: string;
}

export interface CreateClaimResponse {
  id: string;
  community_id: string;
  body: string;
  creator: string;
  created_time: Time;
}

export interface EditClaim {
  id: ID;
  body: string;
}

export interface SubmitArgument {
  claimId: ID;
  summary: string;
  body: string;
  stake_type: StakeType;
}

export interface EditArgument {
  argumentId: ID;
  summary: string;
  body: string;
}

export interface SubmitArgumentResponse {
  id: string;
  claim_id: ID;
  summary: string;
  body: string;
  creator: string;
  created_time: Time;
}

export interface EditedArgumentResponse {
  id: string;
  claim_id: ID;
  summary: string;
  body: string;
  creator: string;
  created_time: Time;
  edited_time: Time;
  edited: boolean;
}

export interface SubmitUpvote {
  argumentId: ID;
}

export interface SubmitUpvoteResponse {
  id: ID;
  argument_id: ID;
  creator: string;
  created_time: Time;
}

export interface SlashArgument {
  argument_id: ID;
  slash_type: SlashType;
  slash_reason: SlashArgumentReason;
  slash_detailed_reason: string;
}

export interface SlashArgumentResponse {
  id: ID;
  argument_id: ID;
}

export interface FlagStory {
  claimId: number;
}

export interface MarkNotificationSeen {
  notification_id: number;
  seen: boolean;
}

export interface MarkNotificationRead {
  notification_id: number;
  read: boolean;
}

export interface EditClaimImage {
  claim_id: ID;
  claim_image_url: string;
}

export interface PostClaimComment {
  claimId: number;
  argumentId?: number;
  elementId?: number;
  body: string;
}

export interface PostClaimQuestion {
  claimId: number;
  body: string;
}

export interface DeleteClaimQuestion {
  id: ID;
}

export interface CreationResponse {
  id: number;
}

export interface RegistrationResponse {
  userId: string;
  address: string;
  invitesLeft: number;
  userProfile: UserProfile;
  userMeta: UserMeta;
  group: string;
  signedUp: boolean;
}

export interface CheckTxResponse {
  code?: number;
  log: string;
  gasWanted: string;
  gasUsed: string;
  tags: object[];
}

export interface BroadcastTxResponse {
  data: string;
  gas_used: string;
  height: number;
  logs: Log[];
  raw_log: string;
  tags: object[];
}

export interface FetchUserResponse {
  userId: string;
  address: string;
  invitesLeft: number;
  userProfile: UserProfile;
  group: string;
  userMeta: UserMeta;
  accountNumber: number;
  sequence: number;
}

export interface VerificationResponse {
  user: FetchUserResponse;
  verified: boolean;
  created: boolean;
}

export interface Log {
  msg_index: number;
  success: boolean;
  log: string;
}

export enum DevicePlatformEnum {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
}

export type DevicePlatformType   = 'android' | 'ios' | 'web' ;

export interface DeviceNotificationRegistrationRequest {
  platform : DevicePlatformType;
  address: string;
  token : string;
}

export interface DeviceNotificationRegistrationResponse {
  id: number;
  platform : DevicePlatformType;
  address: string;
  token : string;
}

export interface DeviceNotificationUnregisterResponse {
  platform : DevicePlatformType;
  token : string;
}

export interface TranslateMentions {
  body: string;
}

export interface InviteAFriend {
  email: string;
}

// User Auth
export interface EmailLogin {
  identifier: string;
  password: string;
}

export interface EmailRegistration {
  full_name: string;
  username: string;
  email: string;
  password: string;
  referrer: string;
}

export interface UpdateUserProfileData {
  full_name: string;
  username: string;
  bio: string;
  avatar_url: string;
}

export interface UpdateUserProfile {
  profile: UpdateUserProfileData;
}

export interface EmailVerification {
  id: ID;
  token: string;
}

export interface AccountRecoveryData {
  identifier: string;
}

export interface ResendEmailData {
  identifier: string;
}

export interface AccountPasswordResetData {
  user_id: ID;
  token: string;
  password: string;
}

export interface OnboardData {
  onboard_follow_communities?: boolean;
  onboard_carousel?: boolean;
  onboard_contextual?: boolean;
}
