import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { useEffect } from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import COMMENTS_QUERY from 'shared/graphql/queries/comments.query';
import CommentsQuery, { CommentsQueryData } from 'shared/graphql/types/CommentsQuery';
import { addCommentDraft, removeCommentDraft } from 'shared/redux/actions/comment-draft.action';
import { CommentDraft } from 'shared/redux/reducers/comment-draft.reducer';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { detectMobileBrowser, detectMobileSafari } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import CommentsInputContainer from 'web/src/components/Comments/CommentsInputContainer';
import CommentsList from './CommentsList';

interface Props extends RouteComponentProps {
  account?: Account;
  selectedCommentId?: ID;
  claimId: ID;
  comment_drafts: CommentDraft[];
  addCommentDraft: (claimId: ID, text: string) => void;
  removeCommentDraft: (claimId: ID) => void;
  style?: React.CSSProperties;
}

// [aamirl]: This component derives responsive styles from web/src/styles/app.scss
let fetchMoreInterval: number;

const VideoCommentsComponent = (props: Props) => {
  const { claimId, style, selectedCommentId, account, comment_drafts, addCommentDraft, removeCommentDraft } = props;
  const [ selectedId, setSelectedId ] = React.useState(selectedCommentId);
  const [ text, setText ] = React.useState('');

  useEffect(() => {
    fetch(`${AppConfig.api.endpoint}/comments/open/${claimId}`);
    const find = comment_drafts.find((draft: CommentDraft) => draft.claimId === claimId);
    find && find.text && setText(find.text);
    return () => {
      clearInterval(fetchMoreInterval);
    };
  }, []);

  const renderComments = (result: QueryResult<CommentsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.comments) return <ErrorComponent onRefresh={ refetch } />;

    let height;
    if (detectMobileSafari()) {
      height = account ? 'calc(100vh - 535px)' : 'calc(100vh - 310px)';
    } else if (detectMobileBrowser()) {
      height = account ? 'calc(100vh - 560px)' : 'calc(100vh - 315px)';
    } else {
      height = account ? 'calc(100vh - 470px)' : 'calc(100vh - 205px)';
    }

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready) return;
      fetchMore({
        variables: { after: data.comments.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.comments || fetchMoreResult.comments.pageInfo.endCursor === '') { return prev; }
          if (fetchMoreResult.comments.pageInfo.endCursor === prev.comments.pageInfo.endCursor) return prev;
          fetchMoreResult.comments.edges =
            prev.comments.edges.concat(fetchMoreResult.comments.edges);
          return fetchMoreResult;
        },
      });
    };

    clearInterval(fetchMoreInterval);
    fetchMoreInterval = setInterval(onFetchMore, 5000);

    const updateDraft = (text: string) => {
      addCommentDraft(claimId, text);
    };

    const postComment = async (text: string) => {
      await Chain.postComment({ claimId, body: text });
      setSelectedId(-1);
      onFetchMore();
      removeCommentDraft(claimId);
      fetch(`${AppConfig.api.endpoint}/comments/open/${claimId}`);
    };

    return (
      <div
        style={ { ...styles.container, ...style } }
        className={ `tru-video-comments` }
      >
        <BaseText textSize={ TextSize.H3 } style={ { marginTop: Whitespace.MEDIUM, display: 'flex' } } bold={ true }>Chat</BaseText>
        <BaseLine style={ { marginTop: Whitespace.MEDIUM } } />
        <CommentsList
          claimComments={ data.comments.edges.map((edge) => edge.node) }
          style={ { paddingRight: Whitespace.SMALL, paddingLeft: Whitespace.SMALL, paddingTop: Whitespace.SMALL, height } }
          selectedCommentId={ selectedId }
        />
        <CommentsInputContainer
          value={ text }
          onChange={ updateDraft }
          postComment={ postComment }
          disabled={ true }
          style={ { border: `1px solid ${Color.LINE_GRAY}`, padding: Whitespace.TINY, paddingTop: 1, borderRadius: Whitespace.TINY } }
        />
      </div>
    );
  };

  return (
    <CommentsQuery query={ COMMENTS_QUERY } variables={ { claimId } }>
      { renderComments }
    </CommentsQuery>
  );

};

const styles = {
  container: { },
};

const mapStateToProps = (state: any) => {
  return {
    comment_drafts: state.comment_drafts.comment_drafts,
    account: state.auth.account,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  addCommentDraft: (claimId: ID, text: string) => {
    return dispatch(addCommentDraft(claimId, text));
  },
  removeCommentDraft: (claimId: ID) => {
    return dispatch(removeCommentDraft(claimId));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VideoCommentsComponent));
