import * as React from 'react';
import BaseButton from 'shared/components/Base/BaseButton';
import { BaseModalHandler } from 'shared/components/BaseModal/BaseModalHandler';
import { TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { AppAccount } from 'shared/types/appAccount';
import UserJourneyModal from 'web/src/components/Modals/UserJourneyModal';
import BaseText from '../Base/BaseText';

interface Props {
  style?: React.CSSProperties;
  referredAppAccounts: AppAccount[];
}

const InvitedFriendsList = (props: Props) => {

  const { style, referredAppAccounts } = props;

  const onViewStatus = (appAccount: AppAccount) => {
    return () => {
      const onClose = () => BaseModalHandler.close();
      BaseModalHandler.basic(
        <UserJourneyModal
          onClose={ onClose }
          appAccount= { appAccount }
        />, { width: '100%', maxWidth: 720 });
    };
  };

  let contentJsx;
  if (referredAppAccounts.length > 0) {
    const listJsx: React.ReactNode[] = [];
    referredAppAccounts.map((appAccount: AppAccount) => {
      listJsx.push(
        <div style={ { display: 'flex', ...styles.listItem } }>
          <BaseText style={ { flex: 1 } }>@{ appAccount.userProfile.username }</BaseText>
          <BaseButton
            title={ 'View Status' }
            onAction={ onViewStatus(appAccount) }
            outline={ false }
            accentColor={ Color.TRANSPARENT }
            color={ Color.APP_PURPLE }
            style={ styles.button }
            className={ 'filled-button' }
          />
        </div>,
        );
    });
    contentJsx = listJsx;
  } else {
    contentJsx = (
      <div style={ { display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' } }>
        <BaseText align={ TextAlign.LEFT }>You haven't invited anyone yet!</BaseText>
      </div>
      );
  }

  return (
    <div style={ { ...styles.container, ...style } }>
      { contentJsx }
    </div>
  );

};

const styles = {
  container: {  },
  listItem: {
    borderBottom: `1px solid ${Color.LINE_GRAY}`,
    paddingTop: Whitespace.LARGE,
    paddingBottom: Whitespace.TINY,
  },
  button: {
    borderRadius: 0,
    borderTopRightRadius: Whitespace.TINY,
    borderBottomRightRadius: Whitespace.TINY,
    justifyContent: `flex-end`,
  },
};

export default InvitedFriendsList;
