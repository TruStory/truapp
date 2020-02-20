import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { useEffect } from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import ArgumentHeader from 'shared/components/Argument/ArgumentHeader';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseCard from 'shared/components/Base/BaseCard';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import COMMENTS_QUERY from 'shared/graphql/queries/comments.query';
import CommentsQuery, { CommentsQueryData } from 'shared/graphql/types/CommentsQuery';
import { addArgumentCommentDraft, removeArgumentCommentDraft } from 'shared/redux/actions/argument-comment-draft.action';
import { ArgumentCommentDraft } from 'shared/redux/reducers/argument-comment-draft.reducer';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { detectMobileBrowser, detectMobileSafari } from 'shared/styles/utils';
import { IconSize, Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Argument } from 'shared/types/argument';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import BaseText from 'web/src/components/Base/BaseText';
import CommentsList from 'web/src/components/Comments/CommentsList';
import TrustoryMarkdown from '../Markdown/TrustoryMarkdown';
import CommentsInputContainer from './CommentsInputContainer';

interface Props {
  account?: Account;
  argument: Argument;
  claimId: ID;
  argumentId: ID;
  elementId: ID;
  selectedCommentId?: ID;
  onClose: () => void;
  argument_comment_drafts: ArgumentCommentDraft[];
  addArgumentCommentDraft: (claimId: ID, argumentId: ID, elementId: ID, text: string) => void;
  removeArgumentCommentDraft: (claimId: ID, argumentId: ID, elementId: ID) => void;
  style?: React.CSSProperties;
}

function displayElementById(elementId: ID) {
  return () => {
    function transformer(tree: any) {

      const wrappedTopLevelNodes = tree.children.filter((topLevelNode: any, index: number) => {
        return index === elementId - 1;
      });
      tree.children = wrappedTopLevelNodes;
      return tree;
    }

    return transformer;
  };
}

let fetchMoreInterval: number;

const ArgumentCommentsModal = (props: Props) => {
  const { argument, claimId, style, account, selectedCommentId, argumentId, elementId, onClose,
    argument_comment_drafts, addArgumentCommentDraft, removeArgumentCommentDraft } = props;
  const [ selectedId, setSelectedId ] = React.useState(selectedCommentId);
  const [ text, setText ] = React.useState('');

  useEffect(() => {
    // mark thread as read
    fetch(`${AppConfig.api.endpoint}/comments/open/${claimId}/${argumentId}/${elementId}`);
    const find = argument_comment_drafts.find((draft: ArgumentCommentDraft) => {
      return draft.claimId === claimId && draft.argumentId === argumentId && draft.elementId === elementId;
    });
    find && find.text && setText(find.text);
    return () => {
      clearInterval(fetchMoreInterval);
    };
  }, []);

  const renderComments = (result: QueryResult<CommentsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.comments) return <ErrorComponent onRefresh={ refetch } />;

    const claimComments = data.comments.edges.map((edge) => edge.node);

    let height;
    const inputHeight = 100;
    let adjust = 683;
    if (detectMobileSafari()) {
      height = account ? adjust - inputHeight : adjust - 250;
    } else if (detectMobileBrowser()) {
      height = account ? adjust - inputHeight : adjust - 250;
    } else {
      height = account ? adjust - inputHeight : adjust - 250;
    }
    height = `calc(100vh - ${height}px)`;

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
      addArgumentCommentDraft(claimId, argumentId, elementId, text);
    };

    const postComment = async (text: string) => {
      await Chain.postComment({ claimId, argumentId, elementId, body: text });
      Analytics.track(AnalyticsEventsWeb.ReplySentSuccessfully , { claimId, argumentId: argument.id, community: argument.communityId });
      setSelectedId(-1);
      onFetchMore();
      removeArgumentCommentDraft(claimId, argumentId, elementId);
      fetch(`${AppConfig.api.endpoint}/comments/open/${claimId}/${argumentId}/${elementId}`);
    };

    return (
      <div style={ { ...styles.container, ...style } } className='tru-argument-comments'>
        <BaseCard style={ { flexDirection: 'column' } }>
          <div style={ styles.topHeading }>
            <BaseText bold={ true } textSize={ TextSize.H2 }>Replies</BaseText>
            <BaseActionable onAction={ onClose }>
              <BaseIconView name={ 'x' } color={ Color.BLACK } size={ IconSize.REGULAR } style={ { marginLeft: Whitespace.TINY } } />
            </BaseActionable>
          </div>
          <ArgumentHeader argument={ argument } style={ { marginBottom: Whitespace.MEDIUM } } />
          <TrustoryMarkdown plugins={ [displayElementById(elementId)] }>{ argument.body }</TrustoryMarkdown>
        </BaseCard>

        <BaseCard style={ { flexDirection: 'column' } }>
          <BaseText bold={ true }>{ data.comments.totalCount } Replies</BaseText>
          <CommentsList
            claimComments={ claimComments }
            style={ { paddingTop: Whitespace.SMALL, minHeight: 100, maxHeight: height, overflowX: 'hidden' } }
            selectedCommentId={ selectedId }
          />
          <CommentsInputContainer
            value= { text }
            postComment={ postComment }
            onChange={ updateDraft }
            disabled={ true }
            height={ inputHeight }
            style={ { marginBottom: -Whitespace.MEDIUM } }
          />
        </BaseCard>
      </div>
    );
  };

  return (
    <CommentsQuery query={ COMMENTS_QUERY } variables={ { claimId, argumentId, elementId } }>
      { renderComments }
    </CommentsQuery>
  );

};

const styles = {
  container: { opacity: 0.97, marginTop: Whitespace.LARGE },
  topHeading: {
    display: 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Whitespace.MEDIUM,
  },
};

const mapStateToProps = (state: any) => {
  return {
    argument_comment_drafts: state.argument_comment_drafts.argument_comment_drafts,
    account: state.auth.account,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  addArgumentCommentDraft: (claimId: ID, argumentId: ID, elementId: ID, text: string) => {
    return dispatch(addArgumentCommentDraft(claimId, argumentId, elementId, text));
  },
  removeArgumentCommentDraft: (claimId: ID, argumentId: ID, elementId: ID) => {
    return dispatch(removeArgumentCommentDraft(claimId, argumentId, elementId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ArgumentCommentsModal);
