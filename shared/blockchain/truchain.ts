import { Platform } from 'react-native';
import AppConfig from 'shared/app-config.json';
import { Account } from 'shared/blockchain/account';
import { Blockchain } from 'shared/blockchain/blockchain';
import { CHAIN_ID, CHAIN_URL } from 'shared/blockchain/parameters';
import { AccountPasswordResetData, AccountRecoveryData, CreateClaim, CreateClaimResponse, DeleteClaimQuestion, DeviceNotificationRegistrationRequest, DeviceNotificationRegistrationResponse, DeviceNotificationUnregisterResponse, DevicePlatformEnum, EditArgument, EditClaim, EditClaimImage, EditedArgumentResponse, EmailLogin, EmailRegistration, EmailVerification, FetchUserResponse, FlagStory, InviteAFriend, MarkNotificationRead, MarkNotificationsSeen, Msg, OnboardData, PostClaimComment, RegistrationRequest, RegistrationResponse, ResendEmailData, SlashArgument, SlashArgumentResponse, SubmitArgument, SubmitArgumentResponse, SubmitUpvote, SubmitUpvoteResponse, TranslateMentions, UpdateUserProfileData, VerificationResponse } from 'shared/blockchain/types';
import { isWeb } from 'shared/styles/utils';
import { Comment } from 'shared/types/comments';

export class TruChain {
  chain: Blockchain;
  account?: Account;

  // on web all requests should be relative /api/v1/action so create react app
  // can correctly proxy all relative requests to localhost:1337 etc
  static Chain = new Blockchain(Platform.OS === DevicePlatformEnum.WEB ? '' : CHAIN_URL);

  constructor({ chain = TruChain.Chain, account }: { chain?: Blockchain, account?: Account}) {
    this.chain = chain;
    this.account = account;
  }

  async register({ authToken, authTokenSecret }: RegistrationRequest): Promise<RegistrationResponse> {
    const resp = await this.chain.register({ authToken, authTokenSecret });
    this.setAccountAfterRegistration(resp);
    return resp;
  }

  async mockRegister(): Promise<RegistrationResponse> {
    const resp = await this.chain.mockRegister();
    this.setAccountAfterRegistration(resp);
    return resp;
  }

  async setAccountAfterRegistration(response: RegistrationResponse) {
    const account = new Account({
      id: response.userId,
      address: response.address,
      userProfile: response.userProfile,
      invitesLeft: response.invitesLeft,
      userMeta: response.userMeta,
      sequence: 0,
      chainId: CHAIN_ID,
      accountNumber: 0,
    });

    this.account = account;
  }

  async registerDeviceToken(request: DeviceNotificationRegistrationRequest)
  : Promise<DeviceNotificationRegistrationResponse> {
    return this.chain.registerDeviceToken(request);
  }

  async unregisterDeviceToken(token: string, platform: string)
  : Promise<DeviceNotificationUnregisterResponse> {
    return this.chain.unregisterDeviceToken(token, platform);
  }

  async queryGraphQL<T>(query: string, variables: object = { }): Promise<T> {
    return this.chain.queryGraphQL<T>(query, variables);
  }

  async publish<T>(...msgs: Msg[]): Promise<T> {
    const result = await this.fetchCurrentUser();
    const { userId, address, userProfile, userMeta, invitesLeft, accountNumber, sequence } = result;
    const account = new Account({
      id: userId,
      address,
      userProfile,
      userMeta,
      invitesLeft,
      sequence: sequence,
      chainId: CHAIN_ID,
      accountNumber: accountNumber,
    });

    if (!account) {
      throw new Error('TruChain Error: No account given - cannot publish messages');
    }

    return this.chain.publish<T>(account, ...msgs);
  }

  async createClaim({ body, communityId, source }: CreateClaim): Promise<CreateClaimResponse> {
    if (!this.account) {
      throw new Error('Cannot create a claim without an account');
    }

    const data = {
      creator: this.account.address,
      body,
      source,
      community_id: communityId,
    };

    const msgBody = this.removeEmptyFields(data);
    const response = await this.publish<CreateClaimResponse>({ type: 'MsgCreateClaim', body: msgBody });
    return response;
  }

  async editClaim({ id, body }: EditClaim): Promise<CreateClaimResponse> {
    if (!this.account) {
      throw new Error('Cannot edit a claim without an account');
    }

    const data = {
      editor: this.account.address,
      id,
      body,
    };

    const msgBody = this.removeEmptyFields(data);
    const response = await this.publish<CreateClaimResponse>({ type: 'MsgEditClaim', body: msgBody });
    return response;
  }

  async submitArgument({ claimId, summary, body, stake_type }: SubmitArgument): Promise<SubmitArgumentResponse> {
    if (!this.account) {
      throw new Error('Cannot submit an argument without an account');
    }

    const bodyWithMentions = await this.translateMentions({ body });
    const data = {
      claim_id: claimId,
      summary,
      body: bodyWithMentions.body,
      stake_type,
      creator: this.account.address,
    };

    const msgBody = this.removeEmptyFields(data);
    const response = await this.publish<SubmitArgumentResponse>({ type: 'MsgSubmitArgument', body: msgBody });
    return response;
  }

  async editArgument({ argumentId, summary, body }: EditArgument): Promise<EditedArgumentResponse> {
    if (!this.account) {
      throw new Error('Cannot submit an argument without an account');
    }

    const bodyWithMentions = await this.translateMentions({ body });
    const data = {
      argument_id: argumentId,
      summary,
      body: bodyWithMentions.body,
      creator: this.account.address,
    };

    const msgBody = this.removeEmptyFields(data);
    const response = await this.publish<EditedArgumentResponse>({ type: 'MsgEditArgument', body: msgBody });
    return response;
  }

  async submitUpvote({ argumentId }: SubmitUpvote): Promise<SubmitUpvoteResponse> {
    if (!this.account) {
      throw new Error('Cannot agree with argument without an account');
    }

    const data = {
      argument_id: argumentId,
      creator: this.account.address,
    };

    const msgBody = this.removeEmptyFields(data);
    const response = await this.publish<SubmitUpvoteResponse>({ type: 'MsgSubmitUpvote', body: msgBody });
    return response;
  }

  async slashArgument({ argument_id, slash_type, slash_detailed_reason, slash_reason }: SlashArgument): Promise<SlashArgumentResponse> {
    if (!this.account) {
      throw new Error('Cannot downvote an argument without an account');
    }

    const data = {
      argument_id,
      slash_type,
      slash_detailed_reason,
      slash_reason,
      creator: this.account.address,
    };

    const msgBody = this.removeEmptyFields(data);
    const response = await this.publish<SlashArgumentResponse>({ type: 'MsgSlashArgument', body: msgBody });
    return response;
  }

  async flagStory({ claimId }: FlagStory): Promise<null> {
    return this.chain.postJSON<null>(`${AppConfig.api.endpoint}/flagStory`, { story_id: claimId });
  }

  async markNotificationsSeen(markNotificationSeen: MarkNotificationsSeen): Promise<null> {
    return this.chain.putJSON<null>(`${AppConfig.api.endpoint}/notification`, markNotificationSeen);
  }

  async markNotificationsRead(markNotificationRead: MarkNotificationRead): Promise<null> {
    return this.chain.putJSON<null>(`${AppConfig.api.endpoint}/notification`, markNotificationRead);
  }

  async editClaimImage(editClaimImageData: EditClaimImage): Promise<null> {
    return this.chain.putJSON<null>(`${AppConfig.api.endpoint}/claim/image`, editClaimImageData);
  }

  async postComment({ claimId, argumentId, elementId, body }: PostClaimComment): Promise<Comment> {
    body = body.replace(/no winters like la/ig, '![Malta](https://s3-us-west-1.amazonaws.com/trustory/images/malta.jpg)');
    return this.chain.postJSON<Comment>(`${AppConfig.api.endpoint}/comments`,
    { claim_id: claimId, argument_id: argumentId, element_id: elementId, body });
  }

  async postQuestion({ claimId, body }: PostClaimComment): Promise<null> {
    return this.chain.postJSON<null>(`${AppConfig.api.endpoint}/questions`, { claim_id: claimId, body });
  }

  async deleteQuestion({ id }: DeleteClaimQuestion): Promise<null> {
    return this.chain.putJSON<null>(`${AppConfig.api.endpoint}/questions`, { id });
  }

  async loginUser({ identifier, password }: EmailLogin): Promise<RegistrationResponse> {
    const resp = await this.chain.postJSON<RegistrationResponse>(`${AppConfig.api.endpoint}/users/authentication`, { identifier, password });
    !isWeb() && this.setAccountAfterRegistration(resp);
    return resp;
  }

  async registerUser({ email, username, full_name, password, referrer }: EmailRegistration): Promise<any> {
    return this.chain.postJSON<null>(`${AppConfig.api.endpoint}/user`, { email, username, full_name, password, referred_by: referrer });
  }

  async updateUser({ username, full_name, bio, avatar_url }: UpdateUserProfileData): Promise<any> {
    return this.chain.putJSON<null>(`${AppConfig.api.endpoint}/user`, { profile: { bio, username, full_name, avatar_url } });
  }

  async verifyEmail({ id, token }: EmailVerification): Promise<VerificationResponse> {
    return this.chain.putJSON<VerificationResponse>(`${AppConfig.api.endpoint}/user/verify`, { id, token });
  }

  async sendAccountRecoveryEmail({ identifier }: AccountRecoveryData): Promise<any> {
    return this.chain.postJSON<null>(`${AppConfig.api.endpoint}/users/password-reset`, { identifier });
  }

  async resendVerificationEmail({ identifier }: ResendEmailData): Promise<any> {
    return this.chain.postJSON<null>(`${AppConfig.api.endpoint}/users/resend-email-verification`, { identifier });
  }

  async resetAccountPassword({ token, password, user_id }: AccountPasswordResetData): Promise<any> {
    return this.chain.putJSON<null>(`${AppConfig.api.endpoint}/users/password-reset`, { token, password, user_id });
  }

  async translateMentions( { body }: TranslateMentions) : Promise<TranslateMentions> {
    return this.chain.postJSON<TranslateMentions>(`${AppConfig.api.endpoint}/mentions/translateToCosmos`, { body });
  }

  async inviteAFriend( invite: InviteAFriend) : Promise<{ data: any, error?: string }> {
    return this.chain.postJSON<{ data: any, error?: string }>(`${AppConfig.api.endpoint}/invite`, invite);
  }

  async followCommunities(communities : Array<string>):  Promise<{ data: any, error?: string }> {
    return this.chain.postJSON<{ data: any, error?: string }>(`${AppConfig.api.endpoint}/communities/follow`, { communities });
  }

  async unfollowCommunity(communityId : string):  Promise<{ data: any, error?: string }> {
    return this.chain.deleteJSON<{ data: any, error?: string }>(`${AppConfig.api.endpoint}/communities/unfollow/${communityId}`, { });
  }

  async onboard(onboardData: OnboardData):  Promise<{ data: any, error?: string }> {
    return this.chain.postJSON<{ data: any, error?: string }>(`${AppConfig.api.endpoint}/users/onboard`, onboardData);
  }

  async fetchCurrentUser(): Promise<FetchUserResponse> {
    return this.chain.getJSON<FetchUserResponse>(`${AppConfig.api.endpoint}/user`);
  }

  removeEmptyFields(msgBody: any) {
    for (const prop in msgBody) {
      if (msgBody[prop] === '' || msgBody[prop] === []) {
        delete msgBody[prop];
      }
    }
    return msgBody;
  }
}
