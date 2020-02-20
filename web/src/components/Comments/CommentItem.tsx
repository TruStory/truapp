import highlightShare from 'highlight-share';
import React, { useEffect } from 'react';
import { StyleProp } from 'react-native';
import { connect } from 'react-redux';
import * as AppConfig from 'shared/app-config.json';
import AppAccountInfo from 'shared/components/AppAccount/AppAccountInfo';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BaseIconView from 'shared/components/Base/BaseIconView';
import CommentMenu from 'shared/components/Comments/CommentMenu';
import TimerComponent from 'shared/components/TimerComponent';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { MobileFontSize, MobileLineHeight, WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import { isWeb } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { Comment } from 'shared/types/comments';
import TrustoryMarkdown from 'web/src/components/Markdown/TrustoryMarkdown';
import { Routes } from 'web/src/navigation/Routes';
import * as clipboardSharer from 'web/src/services/clipboard-sharer';
import * as twitterSharer from 'web/src/services/twitter-sharer';

interface Props {
  comment: Comment;
  style?: StyleProp<any> & React.CSSProperties;
}

const CommentItem = (props: Props) => {
  const { comment, style } = props;
  const { creator, body, createdAt } = comment;

  useEffect(() => {
    let shareUrl = `${AppConfig.base_url}${Routes.CLAIM}${comment.claimId}${Routes.COMMENT}${comment.id}`;
    if (comment.argumentId && comment.elementId) {
      shareUrl = `${AppConfig.base_url}${Routes.CLAIM}${comment.claimId}${Routes.ARGUMENT}${comment.argumentId}${Routes.ELEMENT}${comment.elementId}${Routes.COMMENT}${comment.id}`;
    }
    const highlighter = highlightShare({
      selector: `#comment-${comment.id}`,
      sharers: [twitterSharer, clipboardSharer],
      shareUrl,
    });
    highlighter.init();
    return () => {
      highlighter.destroy && highlighter.destroy();
    };
  }, []);

  return (
    <div style={ { ...styles.container, ...style } }>
      <div style={ { ...styles.commentInfoContainer } }>
        <AppAccountInfo appAccount={ creator } textSize={ TextSize.H6 } avatarSize={ AvatarSize.SMALL } />
        <BaseIconView
          family={ 'Material' }
          color={ Color.GRAY }
          size={ 5 }
          name={ 'fiber-manual-record' }
          style={ { marginLeft: Whitespace.TINY, marginRight: Whitespace.TINY } }
        />
        <TimerComponent
          showElapsedLabel={ true }
          color={ Color.GRAY }
          endTime={ createdAt }
          size={ TextSize.H6 }
          showFullTime={ true }
          style={ { flex: 1 } }
        />
        <CommentMenu
          comment={ comment }
        />
      </div>
      <div id={ `comment-${comment.id}` }>
        <TrustoryMarkdown style={ markdownStyle }>
            { body }
        </TrustoryMarkdown>
      </div>
    </div>
  );
};

const styles = {
  container: { },
  commentInfoContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center',
  },
};

// [aamirl]: This is a special case for the style to be put here because TrustoryMarkdown is being overriden in web
const markdownStyle = {
  lineHeight: `${isWeb ? WebLineHeight.H5 : MobileLineHeight.H5}px`,
  fontSize: isWeb ? WebFontSize.H5 : MobileFontSize.H5,
  color: Color.LIGHT_BLACK,
  marginTop: Whitespace.TINY,
  wordBreak: 'break-word' as 'break-word',
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(CommentItem);
