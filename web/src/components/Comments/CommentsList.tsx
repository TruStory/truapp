import * as React from 'react';
import { StyleProp } from 'react-native';
import { connect } from 'react-redux';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Comment } from 'shared/types/comments';
import CommentItem from 'web/src/components/Comments/CommentItem';

interface CommentsListProps {
  selectedCommentId?: ID;
  account: Account;
  claimComments: Comment[];
  style?: StyleProp<any> & React.CSSProperties;
}

const CommentsList = (props: CommentsListProps) => {
  const { claimComments, style, selectedCommentId } = props;
  const endRef = React.useRef<HTMLDivElement>(null);
  const selectedRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedCommentId && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'auto' });
    } else {
      if (endRef.current) {
        endRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }
  }, [ claimComments, selectedRef, selectedRef.current ]);

  claimComments.sort((a: Comment, b: Comment) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const listJsx: React.ReactNode[] = [];
  claimComments.map((comment: Comment, index: any) => {
    let styleJsx = { };
    if (comment.id === selectedCommentId) {
      styleJsx = {
        marginLeft: -Whitespace.LARGE,
        marginRight: -Whitespace.LARGE,
        paddingRight: Whitespace.LARGE,
        paddingLeft: Whitespace.LARGE,
      };
    }

    listJsx.push(
      <div
        key={ index.toString() }
        className={ comment.id === selectedCommentId ? 'highlight-background' : '' }
        style={ { ...styles.commentContainer,  ...styleJsx } }
        ref={ selectedCommentId && selectedCommentId === comment.id ? selectedRef : null }
      >
        <CommentItem comment={ comment } />
      </div>,
    );
  });

  return (
    <div style={ { ...styles.container, ...style } }>
      { listJsx }
      <div
        style={ { float: 'left', clear: 'both' } }
        ref={ endRef }
      />
    </div>
  );
};

const styles = {
  container: {
    overflow: 'auto',
  },
  commentContainer: {
    marginBottom: Whitespace.MEDIUM,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(CommentsList);
