import { NetworkStatus } from 'apollo-boost';
import CloseButton from 'mobile/src/components/Buttons/CloseButton';
import ClaimHeader from 'mobile/src/components/Claim/ClaimHeader';
import CommentsList from 'mobile/src/components/Comments/CommentsList';
import MarkdownInput from 'mobile/src/components/Markdown/MarkdownInput';
import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import React, { useEffect } from 'react';
import { QueryResult } from 'react-apollo';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import COMMENTS_QUERY from 'shared/graphql/queries/comments.query';
import CommentsQuery, { CommentsQueryData } from 'shared/graphql/types/CommentsQuery';
import { addCommentDraft, removeCommentDraft } from 'shared/redux/actions/comment-draft.action';
import { CommentDraft } from 'shared/redux/reducers/comment-draft.reducer';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';

interface NavigationParams {
  claimId: ID;
  community: string;
  selectedCommentId?: ID;
  text: string;
  settings: Settings;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  comment_drafts: CommentDraft[];
  addCommentDraft: (claimId: ID, text: string) => void;
  removeCommentDraft: (claimId: ID) => void;
}

let fetchMoreInterval: number;

const CommentScreen = (props: Props) => {

  const { navigation, addCommentDraft, comment_drafts, removeCommentDraft } = props;
  const claimId = +navigation.getParam('claimId');
  const selectedCommentId = navigation.getParam('selectedCommentId', 0);
  const [ selectedId, setSelectedId ] = React.useState(selectedCommentId);
  const find = comment_drafts.find((draft: CommentDraft) => draft.claimId === claimId);
  const [ text, setText ] = React.useState(find && find.text ? find.text : '');
  const [ disabled, setDisabled ] = React.useState(false);

  const onMarkdownGenerated = (text: string) => {
    setText(text);
    addCommentDraft(claimId, text);
    navigation.setParams({ text });
  };

  useEffect(() => {
    navigation.setParams({ text: find && find.text ? find.text : '' });
    fetch(`${AppConfig.chain_url}${AppConfig.api.endpoint}/comments/open/${claimId}`);
    return () => {
      clearInterval(fetchMoreInterval);
    };
  }, []);

  const renderComments = (result: QueryResult<CommentsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;

    if (loading && (!data || !data.comments)) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready) return;
      fetchMore({
        variables: { after: data.comments.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.comments || fetchMoreResult.comments.pageInfo.endCursor === '') { return prev; }
          if (fetchMoreResult.comments.pageInfo.endCursor === prev.comments.pageInfo.endCursor) return prev;
          fetchMoreResult.comments.edges =
            prev.comments.edges.concat(fetchMoreResult.comments.edges);
          setSelectedId(Math.floor(Math.random() * 201) - 200);
          return fetchMoreResult;
        },
      });
    };

    clearInterval(fetchMoreInterval);
    fetchMoreInterval = setInterval(onFetchMore, 5000);

    const onSubmit = async () => {
      setDisabled(true);
      const comment = await Chain.postComment({ claimId, body: text });
      Analytics.track(AnalyticsEventsMobile.ChatReplySentSuccessfully , { claimId, community : comment.communityId });
      setDisabled(false);
      onFetchMore();
      fetch(`${AppConfig.chain_url}${AppConfig.api.endpoint}/comments/open/${claimId}`);
      removeCommentDraft(claimId);
      setText('');
      navigation.setParams({ text: '' });
      setSelectedId(Math.floor(Math.random() * 201) - 200);
    };

    const submitButton = (
      <BaseButton
        title=''
        onAction={ onSubmit }
        color={ Color.WHITE }
        outline={ false }
        width={ 20 }
        height={ 40 }
        disabled={ disabled }
        accentColor={ Color.APP_PURPLE }
        style={ { marginLeft: Whitespace.SMALL } }
        icon={ <BaseIconView name={ 'arrow-up' } color={ Color.WHITE } family={ IconFamily.FEATHER } /> }
      />
    );

    return (
      <KeyboardAvoidingView
        style={ styles.container }
        behavior={ 'padding' }
        enabled={ Platform.OS === 'ios' }
        keyboardVerticalOffset={ calculateKeyboardOffset() - actionSheetBottomPadding }
      >
        <ClaimHeader
          claimId={ claimId }
          style={ { marginHorizontal: Whitespace.MEDIUM, marginTop: -Whitespace.LARGE, marginBottom: Whitespace.LARGE } }
          notification={ selectedCommentId && selectedCommentId > 0 ? true : false }
        />
        <CommentsList
          style={ { flex: 1, flexGrow: 1 } }
          claimComments={ data.comments.edges.map((edge) => edge.node) }
          selectedCommentId={ selectedId }
        />
        <MarkdownInput
          value={ text }
          onChange={ onMarkdownGenerated }
          color={ Color.APP_BLACK }
          autoFocus={ true }
          placeholder={ `What do you have to say?` }
          inputStyle={ styles.inputStyle }
          barPosition={ 'top' }
          submitButton={ submitButton }
          allowMentions={ true }
          style={ { marginHorizontal: Whitespace.LARGE, paddingBottom: actionSheetBottomPadding, backgroundColor: Color.WHITE } }
        />
      </KeyboardAvoidingView>
    );
  };

  return (
    <CommentsQuery query={ COMMENTS_QUERY } variables={ { claimId } } fetchPolicy={ 'network-only' }>
      { renderComments }
    </CommentsQuery>
  );
};

CommentScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  return {
    ...headerStyles,
    headerLeft: <BaseText bold={ true } style={ { marginLeft: Whitespace.MEDIUM } } textSize={ TextSize.H2 }>Chat</BaseText>,
    headerRight: <CloseButton position={ 'right' } />,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Whitespace.MEDIUM,
  },
  inputStyle: {
    maxHeight: 200,
    flex: 1,
    borderWidth: 1,
    borderColor: Color.LINE_GRAY,
    paddingHorizontal: Whitespace.MEDIUM,
    paddingVertical: Whitespace.TINY,
    borderRadius: Whitespace.LARGE,
  },
});

const mapStateToProps = (state: any) => {
  return {
    comment_drafts: state.comment_drafts.comment_drafts,
    settings: state.settings.settings,
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen);
