import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Chain from 'shared/blockchain';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import FOLLOW_COMMUNITY_QUERY from 'shared/graphql/queries/follow-community.query';
import { Color } from 'shared/styles/colors';
import { toastOptions } from 'shared/utils/toast';

export enum FollowButtonType {
  BUTTON,
  TEXT,
  ICON,
}

interface Props {
  type: FollowButtonType;
  account: Account;
  following: boolean;
  communityId: string;
  client?: any;
}

const FollowCommunityButton = (props : WithApolloClient<Props>) => {
  const { account, communityId , client, following, type } = props;
  if (!account) return null;
  const refetch = () => {
    client.query({
      query: FOLLOW_COMMUNITY_QUERY,
      variables: { communityId: communityId },
      fetchPolicy: 'network-only',
    });
  };
  const update = async () => {
    if (!following) {
      try {
        await Chain.followCommunities([communityId]);
      }catch (err) {
        toast.error(err.message, toastOptions);
      }
      refetch();
    }
    if (following) {
      try {
        await Chain.unfollowCommunity(communityId);
      }catch (err) {
        toast.error(err.message, toastOptions);
      }
      refetch();
    }
  };

  if (type === FollowButtonType.BUTTON) {

    if (following) {
      return (
        <BaseButton
          width={ 115 }
          title={ 'Following' }
          hoverTitle={ 'Unfollow' }
          outline={ true }
          onAction={ update }
          className={ 'filled-button' }
          hoverColors={ { regularText: Color.APP_PURPLE, hoverText: Color.WHITE, hoverBackground: Color.RED, regularBackground: Color.APP_PURPLE } }
        />
      );
    }
    return (
      <BaseButton
          title={ 'Follow' }
          accentColor={ Color.APP_PURPLE }
          outline={ false }
          onAction={ update }
          color={ Color.WHITE }
          width={ 100 }
          className={ 'filled-button' }
      />);
  } else if ( type === FollowButtonType.TEXT) {
    return (
      <BaseActionable onAction={ update }>
        <BaseText
          color={ following ? Color.APP_PURPLE : Color.APP_BLACK }
        >
          { following ? 'Unfollow' : 'Follow' }
        </BaseText>
      </BaseActionable>

    );
  }

  return (
    <BaseActionable onAction={ update }>
      <BaseIconView
        name={ following ? 'minus-square' : 'plus-square' }
        color={ following ? Color.APP_PURPLE : Color.APP_BLACK }
      />
    </BaseActionable>
  );
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(withApollo(FollowCommunityButton));
