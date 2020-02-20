import { Platform } from 'react-native';
import MixPanel from 'react-native-mixpanel';
import AppConfig from 'shared/app-config.json';
import { isWeb } from 'shared/styles/utils';
import { btoa } from 'shared/utils/base64';

class AnalyticsClass {
  init = (token: string) => {
    MixPanel.sharedInstanceWithToken(token);
  }
  registerAnonymous = () => {
    MixPanel.registerSuperProperties({ platform: Platform.OS, group: 'Anonymous User' , logged : false });
  }
  register = (id: string, fullName: string, username: string, group : string, signUp: boolean,  extraData: any = { }) => {
    try {
      const registerData = {
        ...extraData,
        $name: username,
        fullName,
        group,
      };
      if (signUp) {
        MixPanel.createAlias(id);
      }
      MixPanel.identify(id);
      if (signUp) {
        MixPanel.track(AnalyticsEvents.Registered);
      }
      // user props often can be changed so instead of setOnce use only set
      MixPanel.set(registerData);
      MixPanel.registerSuperProperties({ platform: Platform.OS, group: group , logged : true });
    } catch (e) { }
  }
  reset = () => {
    try {
      MixPanel.reset();
    } catch (e) { }
  }
  track = (event: string, data: any = { }) => {
    try {
      if (data) {
        MixPanel.trackWithProperties(event, data);
      } else {
        MixPanel.track(event);
      }
    } catch (e) { }
  }

  trackInternal =(event: string, properties: any = { }) => {
    try {
      const payload = {
        event,
        properties,
      };
      const requestHeaders: HeadersInit = new Headers();
      if (!isWeb()) {
        requestHeaders.set('X-Mobile-Request', 'true');
      }
      const options : RequestInit =  {
        headers : requestHeaders,
        credentials: isWeb() ? 'same-origin' : 'include',
      };
      fetch(`${AppConfig.chain_url}${AppConfig.api.endpoint}/track/?data=${btoa(JSON.stringify(payload))}`, options);
    } catch (e) { }
  }
}

export const AnalyticsEvents = {
  Registered: 'Registered',
  SuccessfulLogin: 'Successful Login',
  ModalAlertShown: 'Modal Alert Shown',
  Logout: 'Logout',

  StoryFeedCategorySelected: 'Category Selected',
  StoryFeedFilterSelected: 'Filter Selected',
  StoryFeedClaimSelected: 'Claim Selected',

  AddClaimSelectsCategory: 'Add Claim - Selects Category',
  AddClaimAddSourcePressed: 'Add Claim - Add Source Pressed',
  AddClaimAddSourceClosed: 'Add Claim - Add Source Closed w/o Save',
  AddClaimAddSourceSaved: 'Add Claim - Saved Source',
  AddClaimInputFocused: 'Add Claim - Input Focused',
  AddClaimInputUnfocused: 'Add Claim - Input Lost Focus',
  AddClaimDoneModalPressed: 'Add Claim - Done Pressed',
  AddClaimDoneModalClosed: 'Add Claim - Done Pressed',
  AddClaimSubmitted: 'Add Claim - Submitted',

  AddArgumentSelectsBack: 'Add Argument - Selects Back',
  AddArgumentSelectsChallenge: 'Add Argument - Selects Challenge',
  AddLinkPressed: 'Add Link Pressed',
  AddLinkClosed: 'Add Link Closed w/o Save',
  AddLinkSaved: 'Add Link Saved',
  AddImagePressed: 'Add Image Pressed',
  AddImageSelected: 'Add Image Selected',
  AddArgumentDonePressed: 'Add Argument - Done Pressed',
  AddArgumentStakeChosen: 'Add Argument - Stake Chosen',
  AddArgumentClosedOnStakeScreen: 'Add Argument - Closed Stake Modal w/out Confirmation',
  AddArgumentSubmitted: 'Add Argument - Submitted',

  NotificationPressed: 'Notification Pressed',
  FlagStoryPressed: 'Flag Story Pressed',
  FlagStoryConfirmed: 'Flag Story Confirmed',
  FeedOpened : 'Feed Opened',
  ClaimCreated: 'Claim Created',
  ClaimOpened: 'Claim Opened',
  ReadMore: 'Read More',
  ReadLess: 'Read Less',

  AgreeButtonClicked: 'Agree Button Clicked',
  FirstAgree: 'First Agree Sent Successfully',
  AgreeSentSuccessfully: 'Agree Sent Successfully',

  ChatOpened : 'Chat Opened',
  ChatClosed: 'Chat Closed',
  ChatReplySentSuccessfully: 'Chat Reply Sent Successfully',
  AddReplyClicked: 'Add Reply Clicked',
  AddReplyClosed: 'Add Reply Closed',
  ReplySentSuccessfully : 'Reply Sent Successfully',

  SignUpWithEmailClicked: 'Sign Up With Email Clicked',
  SignUpWithTwitterClicked: 'Sign Up With Twitter Clicked',
};

export const AnalyticsEventsMobile = {
  ...AnalyticsEvents,
  OpenApp: 'Opens App',
  ConfirmationEmailClicked: 'Clicked on Confirmation Email',
};

export const AnalyticsEventsWeb = {
  ...AnalyticsEvents,
  SignUpLinkClicked: 'Sign Up Link Clicked',

  RegistrationEmailSent: 'Registration Email Sent',
  ConfirmationEmailClicked: 'Clicked on Confirmation Email',

  SkippedOnboardingCommunities: 'Skipped Onboarding Communities',
  FinishedOnboardingCommunities: 'Finished Onboarding Communities',

  LogoPressed: 'Logo Pressed',
  UserMenuPressed: 'User Menu Pressed',
  ModalDismissed: 'Modal Dismissed',
  AddClaimAddSourceFocused: 'Add Claim - Add Source Focused',
  AddClaimAddSourceUnfocused: 'Add Claim - Add Source Lost Focus',
  AddClaimCategoryFocused: 'Add Claim - Category Focused',
  AddArgumentFocused: 'Add Argument - Input Focused',
  AddArgumentUnfocused: 'Add Argument - Input Lost Focus',
  StoryScreenTabPressed: 'Story Screen - Tab Pressed',
  AddArgumentPressed: 'Add Argument - Pressed',
  EndorseArgumentOpen: 'Endorse Argument - Open',
  EndorseArgumentClose: 'Endorse Argument - Close',
  EndorseArgumentStakeChosen: 'Endorse Argument - Stake Chosen',
  EndorseArgumentSubmitted: 'Endorse Argument - Submitted',
  TransactionListItemPressed: 'Transaction List Item Pressed',
  FooterLinkPressed: 'Footer Link Pressed',
};

const Analytics = new AnalyticsClass();

export default Analytics;
