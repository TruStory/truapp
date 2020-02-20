import React from 'react';
import { QueryResult } from 'react-apollo';
import { View } from 'react-native';
import AppAccountAvatarsPreview from 'shared/components/AppAccount/AppAccountAvatarsPreview';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import COMMENTS_QUERY from 'shared/graphql/queries/comments.query';
import CommentsQuery, { CommentsQueryData } from 'shared/graphql/types/CommentsQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { ID } from 'shared/types';

interface Props {
  claimId: ID;
  argumentId: ID;
  elementId: ID;
  onPress: () => void;
  children?: any;
}

const AddArgumentComment = (props: Props) => {
  const { claimId, argumentId, elementId, onPress, children } = props;

  const renderComments = (result: QueryResult<CommentsQueryData, any>) => {
    const { loading, error, data } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.comments) return null;

    const commentCount = data.comments.totalCount;
    const creators = data.comments.edges.map((comment) => comment.node.creator);
    const plural = commentCount === 1 ? 'y' : 'ies';

    return (
      <View>
        { children }
        <View style= { { flexDirection: 'row', alignItems: 'center' } }>
          <View style={ { width: 32, borderBottomColor: Color.LIGHT_GRAY, borderBottomWidth: 1, marginRight: 8 } } />
          <AppAccountAvatarsPreview
            creators={ creators }
            avatarCount={ 3 }
            size={ AvatarSize.SMALL }
          />
          <BaseActionable onAction={ onPress } style={ { flexDirection: 'row', alignItems: 'center' } }>
            <BaseText textSize={ TextSize.H5 } color={ Color.LIGHT_GRAY }>
              { commentCount > 0 ? `${commentCount} Repl${plural}` : 'Add Reply' }
            </BaseText>
          </BaseActionable>
        </View>
      </View>
    );
  };

  return (
    <CommentsQuery query={ COMMENTS_QUERY } variables={ { claimId, argumentId, elementId } }>
      { renderComments }
    </CommentsQuery>
  );
};

export default AddArgumentComment;
