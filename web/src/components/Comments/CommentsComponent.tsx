import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { useEffect } from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
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
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import BaseText from 'web/src/components/Base/BaseText';
import CommentsInputContainer from 'web/src/components/Comments/CommentsInputContainer';
import CommentsList from 'web/src/components/Comments/CommentsList';

interface Props extends RouteComponentProps {
  account?: Account;
  selectedCommentId?: ID;
  claimId: ID;
  community: string;
  initiallyOpen: boolean;
  comment_drafts: CommentDraft[];
  addCommentDraft: (claimId: ID, text: string) => void;
  removeCommentDraft: (claimId: ID) => void;
  style?: React.CSSProperties;
}

// [aamirl]: This component derives responsive styles from web/src/styles/app.scss

let fetchMoreInterval: number;

const CommentsComponent = (props: Props) => {
  const { claimId, style, account, community, comment_drafts, selectedCommentId, initiallyOpen, addCommentDraft, removeCommentDraft } = props;
  const [ selectedId, setSelectedId ] = React.useState(selectedCommentId);
  const [ open, setOpen ] = React.useState(initiallyOpen);
  const [ text, setText ] = React.useState('');
  // const [ open, setOpen ] = React.useState(selectedCommentId !== undefined);
  const [ animate, setAnimate ] = React.useState(false);
  const [ , setTick ] = React.useState(0);

  useEffect(() => {
    const forceRerender = () => setTick(Math.random());
    window.addEventListener('resize', forceRerender);
    if (open !== false) {
      setAnimate(true);
      fetch(`${AppConfig.api.endpoint}/comments/open/${claimId}`);
      Analytics.track(AnalyticsEventsWeb.ChatOpened , { claimId, community });
    }
    const find = comment_drafts.find((draft: CommentDraft) => draft.claimId === claimId);
    find && find.text && setText(find.text);
    return () => {
      window.removeEventListener('resize', forceRerender);
      clearInterval(fetchMoreInterval);
    };
  }, [open]);

  const renderComments = (result: QueryResult<CommentsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.comments) return <ErrorComponent onRefresh={ refetch } />;

    const claimComments = data.comments.edges.map((edge) => edge.node);

    let height;
    if (detectMobileSafari()) {
      height = account ? 'calc(100vh - 535px)' : 'calc(100vh - 310px)';
    } else if (detectMobileBrowser()) {
      height = account ? 'calc(100vh - 560px)' : 'calc(100vh - 315px)';
    } else {
      height = account ? 'calc(100vh - 430px)' : 'calc(100vh - 205px)';
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
      Analytics.track(AnalyticsEventsWeb.ChatReplySentSuccessfully , { claimId, community });
      setSelectedId(-1);
      onFetchMore();
      removeCommentDraft(claimId);
      fetch(`${AppConfig.api.endpoint}/comments/open/${claimId}`);
    };

    return (
      <div
        style={ { ...styles.container, ...style } }
        className={ `tru-comments ${ animate ? '' : 'preload' } ${ open ? 'slide-out-chat' : 'slide-in-chat' }` }
      >
        <BaseActionable
          onAction={ () => setOpen(!open) }
          style={ { position: 'absolute', top: `${ claimComments.length > 0 ? 50 : 40 }px`, left: `${ claimComments.length > 0 ? -63 : -51 }px` } }
          className={ 'filled-button' }
        >
          <BaseText
            style={ styles.chatText }
            textSize={ TextSize.H6 }
          >
            { open ? 'Close' : 'Open' } Chat { `${claimComments.length > 0 ? '(' + claimComments.length + ')' : ''}` }
          </BaseText>
        </BaseActionable>
        <BaseText textSize={ TextSize.H3 } style={ { marginTop: Whitespace.MEDIUM, display: 'flex' } } bold={ true }>Chat</BaseText>
        <BaseLine style={ { marginTop: Whitespace.MEDIUM } } />
        <CommentsList
          claimComments={ claimComments }
          style={ { paddingRight: Whitespace.SMALL, paddingLeft: Whitespace.SMALL, paddingTop: Whitespace.SMALL, height } }
          selectedCommentId={ selectedId }
        />
        <CommentsInputContainer value={ text } onChange={ updateDraft } postComment={ postComment } disabled={ true } />
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
  container: { backgroundColor: Color.LIGHT_WHITE, opacity: 0.97 },
  chatText: {
    transform: `rotate(90deg)`,
    display: 'inline-block',
    backgroundColor: Color.APP_PURPLE,
    padding: `2px ${Whitespace.SMALL}px ${Whitespace.TINY}px`,
    color: Color.WHITE,
    borderRadius: '0px 0px 10px 10px',
  },
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentsComponent));
