import TrustoryMarkdown from 'mobile/src/components/Markdown/TrustoryMarkdown';
import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
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

interface Props {
  comment: Comment;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const CommentItem = (props: Props) => {
  const { comment, style } = props;
  const { creator, body, createdAt } = comment;

  return (
    <View style={ [ styles.container, style ] }>
      <View style={ styles.commentInfoContainer }>
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
      </View>
      <TrustoryMarkdown style={ markdownStyle }>
        { body }
      </TrustoryMarkdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  commentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// [aamirl]: This is a special case for the style to be put here because TrustoryMarkdown is being overriden in web
const markdownStyle = {
  lineHeight: `${isWeb ? WebLineHeight.H5 : MobileLineHeight.H5}px`,
  fontSize: isWeb ? WebFontSize.H5 : MobileFontSize.H5,
  color: Color.LIGHT_BLACK,
  marginTop: Whitespace.TINY,
  wordBreak: 'break-word',
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(CommentItem);
