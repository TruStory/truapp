import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { StyleProp, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import BaseLine from 'shared/components/Base/BaseLine';
import { MentionType, NotificationData, NotificationType } from 'shared/types/notifications';
import NotificationItem from 'web/src/components/Notifications/NotificationItem';
import { Routes } from 'web/src/navigation/Routes';

interface Props {
  notificationsData: NotificationData[];
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  onLoadMore: () => void;
  hasMore: boolean;
  account?: Account;
}

const NotificationsList = (props: Props) => {

  const { account, notificationsData, onLoadMore, hasMore, style } = props;

  const listJsx: React.ReactNode[] = [];
  notificationsData.map((notification: NotificationData) => {
    let route = '';
    const claimId = notification.meta.claimId || notification.meta.storyId;
    switch (notification.type){
      case NotificationType.ClaimAction:
      case NotificationType.FeaturedDebate:
        route = `${Routes.CLAIM}${claimId}`;
        break;
      case NotificationType.CommentAction:
        route = `${Routes.CLAIM}${claimId}${Routes.COMMENT}${notification.meta.commentId}`;
        break;
      case NotificationType.ArgumentCommentAction:
        route = `${Routes.CLAIM}${claimId}${Routes.ARGUMENT}${notification.meta.argumentId}${Routes.ELEMENT}${notification.meta.elementId}${Routes.COMMENT}${notification.meta.commentId}`;
        break;
      case NotificationType.MentionAction:
        if (notification.meta.mentionType === MentionType.ArgumentMention) {
          route = `${Routes.CLAIM}${claimId}${Routes.ARGUMENT}${notification.meta.argumentId}`;
        }
        if (notification.meta.mentionType === MentionType.CommentMention) {
          route = `${Routes.CLAIM}${claimId}${Routes.COMMENT}${notification.meta.commentId}`;
        }
        if (notification.meta.mentionType === MentionType.ArgumentCommentMention) {
          route = `${Routes.CLAIM}${claimId}${Routes.ARGUMENT}${notification.meta.argumentId}${Routes.ELEMENT}${notification.meta.elementId}${Routes.COMMENT}${notification.meta.commentId}`;
        }
        break;
      case NotificationType.ArgumentAction:
      case NotificationType.EarnedStake:
      case NotificationType.NewArgument:
      case NotificationType.AgreeReceived:
      case NotificationType.NotHelpful:
      case NotificationType.Slashed:
        route = `${Routes.CLAIM}${claimId}${Routes.ARGUMENT}${notification.meta.argumentId}`;
        break;
      case NotificationType.Jailed:
      case NotificationType.Unjailed:
        route = `${Routes.PROFILE}${account ? account.id : ''}`;
        break;
      case NotificationType.RewardInviteUnlocked:
        route = `${Routes.INVITES}`;
        break;
      case NotificationType.RewardTruUnlocked:
      case NotificationType.StakeLimitIncreased:
        route = `${Routes.WALLET}`;
        break;
      default:
        route = `${Routes.CLAIM}${notification.typeId}`;
        break;
    }

    listJsx.push(
      <div key={ notification.id }>
        <NotificationItem
          notification={ notification }
          appLink={ route }
        />
        <BaseLine />
      </div>,
    );
  });

  return (
    <div style={ style }>
      <InfiniteScroll
        loadMore={ onLoadMore }
        hasMore={ hasMore }
        threshold={ 100 }
      >
        { listJsx }
      </InfiniteScroll>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(NotificationsList);
