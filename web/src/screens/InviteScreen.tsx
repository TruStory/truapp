import copy from 'copy-to-clipboard';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import * as AppConfig from 'shared/app-config.json';
import { Account } from 'shared/blockchain/account';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import { truToast } from 'shared/components/Toast/TruToast';
import REFERRED_USERS_QUERY from 'shared/graphql/queries/referred-users.query';
import ReferredUsersQuery, { ReferredUsersData } from 'shared/graphql/types/ReferredUsers';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import InvitedFriendsList from '../components/Invites/InvitedFriendsList';
import InvitesTimeline from '../components/Invites/InvitesTimeline';
import { generateDocumentTitle } from '../utils';

interface Props {
  account: Account;
}

const InviteScreen = (props: Props) => {

  const { account } = props;

  generateDocumentTitle('Invite A Friend');

  const renderList = (result: QueryResult<ReferredUsersData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const { referredAppAccounts } = data;

    const referralLink = `${AppConfig.base_url}${AppConfig.invite_route_url}?referrer=${account.address}`;

    const onCopyLink = () => {
      copy(referralLink);
      truToast('Your personal referral link copied!');
    };

    return (
      <div>
        <div style={ { ...styles.container } } className={ 'columns is-centered' }>
          <div className={ 'column is-7-desktop is-7-tablet' }>
            <div style={ { display: 'flex', flexDirection: 'column' } }>
              <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.SMALL } }>Invite A Friend</BaseText>
              <BaseText>Earn TRU by inviting your friends to join TruStory!</BaseText>
            </div>
            <div style={ { ... styles.referralLinkContainer, display: 'flex', alignItems: 'center', marginTop: Whitespace.MEDIUM } }>
              <BaseText style={ { flex: 1 } }>{ referralLink }</BaseText>
              <BaseButton
                title={ 'Copy' }
                onAction={ onCopyLink }
                outline={ false }
                accentColor={ Color.TRANSPARENT }
                color={ Color.APP_PURPLE }
                style={ styles.button }
                className={ 'filled-button' }
              />
            </div>
          </div>
          <div className={ 'column is-5-desktop is-4-tablet is-hidden-mobile' }>
            <div style={ styles.breakdownContainer }>
              <BaseText bold={ true } textSize={ TextSize.H3 }>Breakdown</BaseText>
              <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
              <div style={ { display: 'flex', flexDirection: 'column' } }>
                <BaseText color={ Color.APP_PURPLE }>5 TRU</BaseText>
                <BaseText>Friend joins the app</BaseText>
              </div>
              <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.SMALL } } />
              <div style={ { display: 'flex', flexDirection: 'column' } }>
                <BaseText color={ Color.APP_PURPLE }>10 TRU</BaseText>
                <BaseText>Friend writes their first argument</BaseText>
              </div>
              <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.SMALL } } />
              <div style={ { display: 'flex', flexDirection: 'column' } }>
                <BaseText color={ Color.APP_PURPLE }>25 TRU</BaseText>
                <BaseText>Friend receives 5 Agrees</BaseText>
              </div>
            </div>
          </div>
        </div>
        <BaseLine style={ { marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } } />
        <div style={ { ...styles.container } } className={ 'columns is-centered' }>
          <div className={ 'column is-12-desktop is-12-tablet' }>
            <div style={ { display: 'flex', flexDirection: 'column' } }>
              <BaseText textSize={ TextSize.H4 } bold={ true } style={ { marginBottom: Whitespace.TINY } }>
                Invites Available: { account.invitesLeft }
              </BaseText>
              <BaseText>To get your first set of <strong>three</strong> invites, you must complete three milestones.</BaseText>
              <InvitesTimeline account={ account } />
            </div>
          </div>
        </div>
        <BaseLine style={ { marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } } />
        <div style={ { ...styles.container } } className={ 'columns is-centered' }>
          <div className={ 'column is-12-desktop is-12-tablet' }>
            <div style={ { display: 'flex', flexDirection: 'column' } }>
              <BaseText textSize={ TextSize.H4 } bold={ true } style={ { marginBottom: Whitespace.TINY } }>Invited Friends</BaseText>
              <BaseText>For every friend who completes all three milestones, you'll receive <strong>three</strong> more invites.</BaseText>
              <InvitedFriendsList referredAppAccounts={ referredAppAccounts } style={ { marginTop: Whitespace.LARGE } } />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ReferredUsersQuery query={ REFERRED_USERS_QUERY }>
      { renderList }
    </ReferredUsersQuery>
  );
};

const styles = {
  container: { paddingTop: Whitespace.MEDIUM },
  input: {
    border: `1px solid ${Color.LINE_GRAY}`,
    height: 25,
    padding: Whitespace.SMALL,
    borderRadius: 0,
    borderTopLeftRadius: Whitespace.TINY,
    borderBottomLeftRadius: Whitespace.TINY,
  },
  button: {
    borderRadius: 0,
    height: 47,
    borderTopRightRadius: Whitespace.TINY,
    borderBottomRightRadius: Whitespace.TINY,
    justifyContent: `flex-end`,
  },
  image: {
    width: 125,
    height: 125,
  },
  columnContainer: { display: 'flex', justifyContent: 'center', flexDirection: 'column' as 'column', alignItems: 'center' },
  breakdownContainer: {
    padding: Whitespace.MEDIUM,
    boxShadow: `rgba(171, 167, 191, 0.20) 0px 0px 10px 0px`,
    marginLeft: Whitespace.LARGE,
    marginRight: Whitespace.SMALL,
  },
  referralLinkContainer: {
    border: `1px solid ${Color.LINE_GRAY}`,
    borderRadius: `5px`,
    padding: Whitespace.SMALL,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(InviteScreen);
