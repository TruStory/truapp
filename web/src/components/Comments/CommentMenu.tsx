import Tippy from '@tippy.js/react';
import copy from 'copy-to-clipboard';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import AppConfig from 'shared/app-config.json';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { truToast } from 'shared/components/Toast/TruToast';
import { share_black, share_purple } from 'shared/images/Share/ShareImages';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Comment } from 'shared/types/comments';
import tippy from 'tippy.js';
import { ViewWidths } from 'web/src/styles';
import 'web/src/styles/tippy.css';
import { Routes } from '../../navigation/Routes';
import MenuItem from '../DropdownMenu/MenuItem';

interface Props extends RouteComponentProps {
  comment: Comment;
  onFlagComment?: (commentId: ID) => void;
  style?: React.CSSProperties;
  account?: Account;
}

const CommentMenu = (props: Props) => {

  const { comment, style } = props;
  // const onFlagCommentAction = () => {
  //   tippy.hideAll({ duration: 0 });
  //   onFlagComment ? onFlagComment(comment.id) : null;
  // };
  const onCopyLink = () => {
    tippy.hideAll({ duration: 0 });
    if (comment.argumentId && comment.elementId) {
      copy(`${AppConfig.base_url}${Routes.CLAIM}${comment.claimId}${Routes.ARGUMENT}${comment.argumentId}${Routes.ELEMENT}${comment.elementId}${Routes.COMMENT}${comment.id}`);
    } else {
      copy(`${AppConfig.base_url}${Routes.CLAIM}${comment.claimId}${Routes.COMMENT}${comment.id}`);
    }
    truToast('Link Copied to Clipboard');
  };

  const content = (
    <div style={ styles.menu }>
      <MenuItem
        onClick={ onCopyLink  }
        icon={ { active: share_purple, regular: share_black } }
        style={ { borderRadius: 10 } }
      >
        Share Comment Link
      </MenuItem>
    </div>
  );

  const onShow = () => tippy.hideAll({ duration: 0 });

  return (
    <div style={ { ...styles.container, ...style } }>
      <Tippy
        interactive={ true }
        interactiveBorder={ 10 }
        content={ content }
        delay={ [100, 0] }
        theme={ 'light' }
        placement={ 'bottom-end' }
        popperOptions={ { modifiers: { preventOverflow: { enabled : false }, hide: { enabled : false }  } } }
        onShow={ onShow }
        animation={ 'shift-away' }
        trigger={ 'click' }
      >
        <div className={ 'menu-icon-overlay' } style={ { cursor: 'pointer', marginTop: 3 } }>
          <BaseIconView  family={ 'Feather' } name={ 'more-horizontal' } color={ Color.APP_BLACK } />
        </div>
      </Tippy>
    </div>
  );
};

const styles = {
  container: { display: 'flex', alignItems:  'center' },
  menu: {
    borderRadius: Whitespace.LARGE,
    width: ViewWidths.ARGUMENT_MENU,
  },
};

export default withRouter(CommentMenu);
