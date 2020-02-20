import React from 'react';
import { QueryResult } from 'react-apollo';
import AppAccountAvatarsPreview from 'shared/components/AppAccount/AppAccountAvatarsPreview';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseText from 'shared/components/Base/BaseText';
import COMMENTS_QUERY from 'shared/graphql/queries/comments.query';
import CommentsQuery, { CommentsQueryData } from 'shared/graphql/types/CommentsQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';

interface Props {
  claimId: ID;
  community: string;
  argumentId: ID;
  elementId: ID;
  onOpenArgumentComment?: (argumentId: ID, elementId: ID, selectedComment?: ID) => void;
  children: React.ReactNode | React.ReactNode[];
}

const AddArgumentComment = (props: Props) => {
  const { claimId, argumentId, elementId, onOpenArgumentComment, children } = props;

  const onPress = () => {
    onOpenArgumentComment && onOpenArgumentComment(argumentId, elementId);
  };

  const renderComments = (result: QueryResult<CommentsQueryData, any>) => {
    const { loading, error, data } = result;
    if (loading) return null;
    if (error || !data || !data.comments) return null;

    const commentCount = data.comments.totalCount;
    const creators = data.comments.edges.map((comment) => comment.node.creator);
    const plural = commentCount === 1 ? 'y' : 'ies';

    return (
      <React.Fragment>
        { children }
        <div style={ { display: 'flex', alignItems: 'center', marginTop: -Whitespace.SMALL, marginBottom: Whitespace.MEDIUM } }>
          <div style={ { width: 24, borderBottom: `1px solid ${Color.LIGHT_GRAY}`, marginRight: 8 } } />
          <AppAccountAvatarsPreview
            creators={ creators }
            avatarCount={ 3 }
            size={ AvatarSize.SMALL }
          />
          <BaseActionable onAction={ onPress } style={ { width: 200 } }>
            <BaseText textSize={ TextSize.H5 } color={ Color.LIGHT_GRAY }>
              { commentCount > 0 ? `${commentCount} Repl${plural}` : 'Add Reply' }
            </BaseText>
          </BaseActionable>
        </div>
      </React.Fragment>
    );
  };

  return (
    <CommentsQuery query={ COMMENTS_QUERY } variables={ { claimId, argumentId, elementId } }>
      { renderComments }
    </CommentsQuery>
  );
};

export default AddArgumentComment;
