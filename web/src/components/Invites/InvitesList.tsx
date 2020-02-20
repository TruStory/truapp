import * as React from 'react';
import { TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Invite } from 'shared/types/invite';
import BaseText from '../Base/BaseText';

interface Props {
  style?: React.CSSProperties;
  invites: Invite[];
}

const InvitesList = (props: Props) => {

  const { style, invites } = props;

  let contentJsx;

  if (invites.length > 0) {
    const listJsx: React.ReactNode[] = [];
    invites.map((invite: Invite) => {
      const registered = invite.friend !== null;

      listJsx.push(
        <div style={ { display: 'flex' } }>
          <BaseText style={ { flex: 1 } }>{ invite.friendEmail }</BaseText>
          <BaseText color={ registered ? Color.APP_PURPLE : Color.RED }>
            { registered ? 'Joined' : `Hasn't signed up` }
          </BaseText>
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
};

export default InvitesList;
