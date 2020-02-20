import { Routes } from 'mobile/src/navigation/Routes';
import NavigationService from 'mobile/src/utils/NavigationService';
import { MentionType, NotificationData, NotificationType } from 'shared/types/notifications';
import { Settings } from 'shared/types/settings';

export const routeNotification = (notification: NotificationData, settings: Settings): { route: string, params: any } => {
  let route = Routes.Feed, params = {  };

  switch (notification.type){
    case NotificationType.ClaimAction:
    case NotificationType.FeaturedDebate:
      route = Routes.ClaimStack;
      params = { claimId: notification.meta.claimId };
      break;
    case NotificationType.CommentAction:
      route = Routes.CommentStack;
      params = { claimId: notification.meta.claimId, selectedCommentId: notification.meta.commentId, settings };
      break;
    case NotificationType.ArgumentCommentAction:
      route = Routes.ArgumentCommentStack;
      params = {
        claimId: notification.meta.claimId,
        argumentId: notification.meta.argumentId,
        elementId: notification.meta.elementId,
        selectedCommentId: notification.meta.commentId,
        settings,
      };
      break;
    case NotificationType.MentionAction:
      if (notification.meta.mentionType === MentionType.ArgumentMention) {
        route = Routes.ArgumentStack;
        params = { argumentId: notification.meta.argumentId, settings };
      }
      if (notification.meta.mentionType === MentionType.CommentMention) {
        route = Routes.CommentStack;
        params = { claimId: notification.meta.claimId, selectedCommentId: notification.meta.commentId, settings };
      }
      if (notification.meta.mentionType === MentionType.ArgumentCommentMention) {
        route = Routes.ArgumentCommentStack;
        params = {
          claimId: notification.meta.claimId,
          argumentId: notification.meta.argumentId,
          elementId: notification.meta.elementId,
          selectedCommentId: notification.meta.commentId,
          settings,
        };
      }
      break;
    case NotificationType.ArgumentAction:
    case NotificationType.EarnedStake:
    case NotificationType.NewArgument:
    case NotificationType.AgreeReceived:
    case NotificationType.NotHelpful:
    case NotificationType.Slashed:
      route = Routes.ClaimStack;
      params = { claimId: notification.meta.claimId, argumentId: notification.meta.argumentId, settings };
      break;
    case NotificationType.Jailed:
    case NotificationType.Unjailed:
      break;
    case NotificationType.RewardInviteUnlocked:
      break;
    case NotificationType.RewardTruUnlocked:
    case NotificationType.StakeLimitIncreased:
      route = Routes.Wallet;
      break;
    default:
      break;
  }

  return { route, params };
};

export const handleOpenURL = ({ url }: { url: string }) => {
  if (url.includes('register/verify')) {
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      urlParams: any = { },
      match;
    while (match = regex.exec(url)) {
      urlParams[match[1]] = match[2];
    }

    if (urlParams['id']) {
      NavigationService.navigate(Routes.ProcessVerification, urlParams);
      return;
    }

    return;
  }

  const splitUrl = url.split('/');
  let claimId = 0, elementId = 0, selectedCommentId = 0, argumentId = 0, accountId = '', params = { }, route = '';

  for (let i = 0; i < splitUrl.length; i++) {
    if (splitUrl[i] === 'profile') {
      accountId = splitUrl[i + 1];
    }
    if (splitUrl[i] === 'claim') {
      claimId = +splitUrl[i + 1];
    }
    if (splitUrl[i] === 'argument') {
      argumentId = +splitUrl[i + 1];
    }
    if (splitUrl[i] === 'comment') {
      selectedCommentId = +splitUrl[i + 1];
    }
    if (splitUrl[i] === 'element') {
      elementId = +splitUrl[i + 1];
    }
  }

  // special case for profile
  if (accountId !== '') {
    NavigationService.navigate(Routes.AppAccount, { accountId });
    return;
  }

  params = { claimId, elementId, selectedCommentId, argumentId };

  if (elementId !== 0) {
    route = Routes.ArgumentCommentStack;
  } else if ( selectedCommentId !== 0 ) {
    route = Routes.CommentStack;
  } else if (argumentId !== 0) {
    route = Routes.ClaimStack;
  } else if (claimId !== 0) {
    route = Routes.ClaimStack;
  }

  NavigationService.navigate(route, params, `${Routes.Comment}-${claimId}`);
};
