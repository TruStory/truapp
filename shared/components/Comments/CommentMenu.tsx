import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import AppConfig from 'shared/app-config.json';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import NativeShareSheet from 'shared/components/Share/NativeShareSheet';
import { share_gray } from 'shared/images/ArgumentActions/ArgumentActionsImages';
import { IconSize } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Comment } from 'shared/types/comments';

interface Props {
  comment: Comment;
  onFlagComment?: (commentId: ID) => void;
  style?: StyleProp<ViewStyle>;
  account?: Account;
}

const CommentMenu = (props: Props) => {

  const { comment, style } = props;

  return (
      <NativeShareSheet
        style={ style }
        message={ `${AppConfig.base_url}${AppConfig.share_route_urls.claim}${comment.claimId}${AppConfig.share_route_urls.comment}${comment.id}` }
      >
        <BaseIconImageView size={ IconSize.XSMALL } source={ share_gray } />
      </NativeShareSheet>
  );
};

CommentMenu.defaultProps = { };

export default CommentMenu;
