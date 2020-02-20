import React from 'react';
import { match, RouteComponentProps, withRouter } from 'react-router';
import { BaseModalHandler } from 'shared/components/BaseModal/BaseModalHandler';
import { Color } from 'shared/styles/colors';
import { ID } from 'shared/types';
import { Argument } from 'shared/types/argument';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import ArgumentCommentsModal from '../Comments/ArgumentCommentsModal';
import TrustoryMarkdown from '../Markdown/TrustoryMarkdown';
import AddArgumentComment from './AddArgumentComment';

interface Params {
  claimId?: string;
  selectedArgumentId?: string;
  selectedElementId?: string;
  selectedCommentId?: string;
}

interface Props extends RouteComponentProps {
  argument: Argument;
  argumentOpened?: boolean;
  children: string;
  match: match<Params>;
}

function injectArgumentCommentElements() {
  function transformer(tree: any) {

    const wrappedTopLevelNodes = tree.children.map((topLevelNode: any) => {
      return {
        type: 'argument_comment',
        position: topLevelNode.position,
        children: [topLevelNode],
      };
    });

    tree.children = wrappedTopLevelNodes;
    return tree;
  }

  return transformer;
}

const ArgumentComments = (props: Props) => {
  const { argument, argumentOpened, children, match, history } = props;

  const selectedArgumentId = match.params.selectedArgumentId ? parseInt(match.params.selectedArgumentId) : undefined;
  const selectedElementId = match.params.selectedElementId ? parseInt(match.params.selectedElementId) : undefined;
  const selectedCommentId = match.params.selectedCommentId ? parseInt(match.params.selectedCommentId) : undefined;

  // Open permalinks on page load
  React.useEffect(() => {
    if (selectedArgumentId && selectedElementId && selectedArgumentId === argument.id) {
      onOpenArgumentComment(selectedArgumentId, selectedElementId, selectedCommentId);
    }
    const unlisten = history.listen(location => BaseModalHandler.close());
    return () => {
      unlisten();
    };
  }, []);

  const onClose = () => {
    BaseModalHandler.close();
    Analytics.track(AnalyticsEventsWeb.AddReplyClosed , { claimId: argument.claimId, argumentId: argument.id, community: argument.communityId });
  };

  const onOpenArgumentComment = (argumentId: ID, elementId: ID, selectedCommentId?: ID) => {
    BaseModalHandler.basic(
      <ArgumentCommentsModal
        argument={ argument }
        claimId={ argument.claimId }
        argumentId={ argumentId }
        elementId={ elementId }
        selectedCommentId={ selectedCommentId }
        onClose={ onClose }
      />,
      styles.modal,
      true,
    );
    Analytics.track(AnalyticsEventsWeb.AddReplyClicked , { claimId: argument.claimId, argumentId: argument.id, community: argument.communityId });
  };

  const addReplyJsx = (props: { index: number, children: any }) => {
    return (
      <AddArgumentComment
        claimId={ argument.claimId }
        community={ argument.communityId }
        argumentId={ argument.id }
        elementId={ props.index + 1 }
        onOpenArgumentComment={ onOpenArgumentComment }
      >
        { props.children }
      </AddArgumentComment>
    );
  };

  if (!argumentOpened) {
    return null;
  }

  return (
    <TrustoryMarkdown
      plugins={ [ injectArgumentCommentElements ] }
      renderers={ { 'argument_comment' : addReplyJsx } }
    >
      { children }
    </TrustoryMarkdown>
  );
};

const styles = {
  modal: {
    backgroundColor: Color.TRANSPARENT,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    maxWidth: 540,
    marginBottom: 0,
    top: 0,
  },
};

export default withRouter(ArgumentComments);
