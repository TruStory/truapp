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
import { addArgumentCommentDraft, removeArgumentCommentDraft } from 'shared/redux/actions/argument-comment-draft.action';
import { ArgumentCommentDraft } from 'shared/redux/reducers/argument-comment-draft.reducer';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';

interface NavigationParams {
  claimId: ID;
  argumentId: ID;
  elementId: ID;
  selectedCommentId?: ID;
  text: string;
  settings: Settings;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  argument_comment_drafts: ArgumentCommentDraft[];
  addArgumentCommentDraft: (claimId: ID, argumentId: ID, elementId: ID, text: string) => void;
  removeArgumentCommentDraft: (claimId: ID, argumentId: ID, elementId: ID) => void;
}

let fetchMoreInterval: number;

const ArgumentCommentScreen = (props: Props) => {

  const { navigation, addArgumentCommentDraft, argument_comment_drafts, removeArgumentCommentDraft } = props;
  const claimId = +navigation.getParam('claimId');
  const argumentId = +navigation.getParam('argumentId');
  const elementId = +navigation.getParam('elementId');
  const selectedCommentId = +navigation.getParam('selectedCommentId', 0);
  const [ selectedId, setSelectedId ] = React.useState(selectedCommentId);
  const find = argument_comment_drafts.find((draft: ArgumentCommentDraft) => {
    return draft.claimId === claimId && draft.argumentId === argumentId && draft.elementId === elementId;
  });
  const [ text, setText ] = React.useState(find && find.text ? find.text : '');
  const [ disabled, setDisabled ] = React.useState(false);

  const onMarkdownGenerated = (text: string) => {
    setText(text);
    addArgumentCommentDraft(claimId, argumentId, elementId, text);
    navigation.setParams({ text });
  };

  useEffect(() => {
    navigation.setParams({ text: find && find.text ? find.text : '' });
    // mark thread as read
    fetch(`${AppConfig.chain_url}${AppConfig.api.endpoint}/comments/open/${claimId}/${argumentId}/${elementId}`);
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
      const comment = await Chain.postComment({ claimId, argumentId, elementId, body: text });
      Analytics.track(AnalyticsEventsMobile.ReplySentSuccessfully , { claimId, argumentId: argumentId, community: comment.communityId });
      setDisabled(false);
      onFetchMore();
      fetch(`${AppConfig.api.endpoint}/comments/open/${claimId}/${argumentId}/${elementId}`);
      removeArgumentCommentDraft(claimId, argumentId, elementId);
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

    // tslint:disable: jsx-no-multiline-js
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
          style={ { marginHorizontal: Whitespace.LARGE, paddingBottom: actionSheetBottomPadding, backgroundColor: Color.WHITE } }
          allowMentions={ true }
        />
      </KeyboardAvoidingView>
    );
  };

  return (
    <CommentsQuery query={ COMMENTS_QUERY } variables={ { claimId, argumentId, elementId } } fetchPolicy={ 'network-only' }>
      { renderComments }
    </CommentsQuery>
  );
};

ArgumentCommentScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  return {
    ...headerStyles,
    headerLeft: <BaseText bold={ true } style={ { marginLeft: Whitespace.MEDIUM } } textSize={ TextSize.H2 }>Replies</BaseText>,
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
    argument_comment_drafts: state.argument_comment_drafts.argument_comment_drafts,
    settings: state.settings.settings,
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

export default connect(mapStateToProps, mapDispatchToProps)(ArgumentCommentScreen);
