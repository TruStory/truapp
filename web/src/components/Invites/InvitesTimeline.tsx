import * as React from 'react';
import { Account } from 'shared/blockchain/account';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props {
  account: Account;
  style?: React.CSSProperties;
}

const InvitesTimeline = (props: Props) => {

  const { account, style } = props;

  let contentJsx;

  contentJsx = (
    <div className='timeline'>
        <div className='timeline-item'>
            <label htmlFor='signed_up'>Signed Up</label>
            <input
              type='checkbox'
              disabled={ true }
              name='signed_up'
              checked={ account.userMeta.journey &&  account.userMeta.journey.indexOf('signed_up') > -1 }
            />
        </div>

        <div className='timeline-item'>
            <label htmlFor='one_argument'>Write An Argument</label>
            <input
              type='checkbox'
              disabled={ true }
              name='one_argument'
              checked={ account.userMeta.journey &&  account.userMeta.journey.indexOf('one_argument') > -1 }
            />
        </div>

        <div className='timeline-item'>
            <label htmlFor='received_five_agrees'>Receive five Agrees</label>
            <input
              type='checkbox'
              disabled={ true }
              name='received_five_agrees'
              checked={ account.userMeta.journey &&  account.userMeta.journey.indexOf('received_five_agrees') > -1 }
            />
        </div>
    </div>
  );

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

export default InvitesTimeline;
