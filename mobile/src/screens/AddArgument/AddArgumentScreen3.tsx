
import TrustoryMarkdown from 'mobile/src/components/Markdown/TrustoryMarkdown';
import { headerStyles } from 'mobile/src/styles';
import React from 'react';
import { QueryResult, withApollo, WithApolloClient } from 'react-apollo';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { CodeType } from 'shared/blockchain/errors';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ClaimText from 'shared/components/Claim/ClaimText';
import ErrorComponent from 'shared/components/ErrorComponent';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import OutOfTruModal from 'shared/components/Modals/OutOfTruModal';
import StakeConfirmationModal from 'shared/components/Modals/StakeConfirmationModal';
import StakingLimitModal from 'shared/components/Modals/StakingLimitModal';
import { truToastError, truToastSuccess } from 'shared/components/Toast/TruToast';
import ARGUMENT_QUERY from 'shared/graphql/queries/argument.query';
import ARGUMENTS_QUERY from 'shared/graphql/queries/arguments.query';
import CLAIM_QUERY from 'shared/graphql/queries/claim.query';
import ClaimQuery, { ClaimQueryData } from 'shared/graphql/types/ClaimQuery';
import { addDraftVote, removeDraft } from 'shared/redux/actions/argument-draft.action';
import { ArgumentDraft } from 'shared/redux/reducers/argument-draft.reducer';
import { TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { StakeType } from 'shared/types/stake';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';

interface NavigationParams {
  claimId: ID;
  edit?: boolean;
  argumentId?: ID;
  setModalVisible: any;
  drafts: ArgumentDraft[];
  client: any;
  removeDraft: (claimId: ID) => void;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  drafts: ArgumentDraft[];
  addDraftVote: (claimId: ID, vote: boolean) => void;
  removeDraft: (claimId: ID) => void;
  client: any;
}

const AddArgumentScreen3 = (props:  WithApolloClient<Props>) => {

  const { navigation, addDraftVote, drafts, removeDraft, client } = props;
  const claimId = navigation.getParam('claimId');
  const find = drafts.find((draft: ArgumentDraft) => draft.claimId === claimId);

  const summaryText = find && find.summaryText ? find.summaryText : '';
  const argumentText = find && find.argumentText ? find.argumentText : '';
  const argumentVote = find && (find.vote || find.vote === false) ? find.vote : true;

  const [ modalVisible, setModalVisible ] = React.useState(false);
  const [ outOfTruModalVisible, setOutOfTruModalVisible ] = React.useState(false);
  const [ stakingLimitModalVisible, setStakingLimitModalVisible ] = React.useState(false);

  React.useEffect(() => {
    navigation.setParams({ setModalVisible, drafts, client, removeDraft });
  }, []);

  const [ vote , setVote ] = React.useState(argumentVote);
  const updateVote = (vote: boolean) => {
    setVote( vote );
    addDraftVote(claimId, vote);
  };

  const renderScreen = (result: QueryResult<ClaimQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    const { claim } = data;

    const postArgument = async () => {
      setModalVisible(false);
      LoadingBlanketHandler.show();
      try {
        const stakeType =  vote === true ? StakeType.Backing : StakeType.Challenge;
        const stakeTypeDescription =  vote === true ? 'Backing' : 'Challenge';
        const resp = await Chain.submitArgument({
          claimId: claimId,
          stake_type: vote === true ? StakeType.Backing : StakeType.Challenge,
          summary: summaryText,
          body: argumentText,
        });
        console.log('PUBLISH RESPONSE: ', resp);
        Analytics.track(AnalyticsEventsMobile.AddArgumentSubmitted, {
          claimId: claimId,
          community: claim.community.id,
          type: stakeType,
          typeDescription: stakeTypeDescription,
        });
        removeDraft(claimId);
        navigation.dismiss();

        client.query({
          query: ARGUMENTS_QUERY,
          variables: { claimId, cacheBuster: resp.id },
          fetchPolicy: 'network-only',
        });
      } catch (err) {
        if (err.code === CodeType.CodeMinBalance) {
          setOutOfTruModalVisible(true);
        } else if (err.code === CodeType.CodeMaxAmountStakingReached) {
          setStakingLimitModalVisible(true);
        } else {
          AlertModalHandler.alert('Oops!', `Your ${ vote ? 'back' : 'challenge' } argument failed to submit: ${err}`);
        }
      } finally {
        LoadingBlanketHandler.hide();
      }
    };

    return (
      <ScrollView style={ styles.container }>
        <ClaimText claim={ claim } />
        <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
        <BaseText bold={ true } style={ { marginBottom: Whitespace.SMALL } }>TLDR</BaseText>
        <ArgumentSummaryText summary={ summaryText } />
        <BaseText bold={ true } style={ { marginTop: Whitespace.MEDIUM } }>Argument</BaseText>
        <TrustoryMarkdown>{ argumentText }</TrustoryMarkdown>
        <ActionSheet visible={ modalVisible } onCancel={ () => setModalVisible(false) }>
          <StakeConfirmationModal
            onUpdateVote={ (vote: boolean) => updateVote(vote) }
            onSubmit={ () => postArgument() }
            vote={ vote }
            style={ { paddingBottom: actionSheetBottomPadding } }
          />
        </ActionSheet>
        <ActionSheet visible={ outOfTruModalVisible } onCancel={ () => setOutOfTruModalVisible(false) }>
          <OutOfTruModal onClose={ () => setOutOfTruModalVisible(false) } />
        </ActionSheet>
        <ActionSheet visible={ stakingLimitModalVisible } onCancel={ () => setStakingLimitModalVisible(false) }>
          <StakingLimitModal onClose={ () => setStakingLimitModalVisible(false) } />
        </ActionSheet>
      </ScrollView>
    );
  };

  return (
    <ClaimQuery query={ CLAIM_QUERY } variables={ { claimId } }>
      { renderScreen }
    </ClaimQuery>
  );
};

AddArgumentScreen3.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const edit = navigation.getParam('edit', false);
  const onFinish = () => {
    const setModalVisible = navigation.getParam('setModalVisible');
    setModalVisible(true);
  };

  const onUpdate = async () => {

    const drafts = navigation.getParam('drafts');
    const claimId = navigation.getParam('claimId');
    const argumentId = navigation.getParam('argumentId');
    const removeDraft = navigation.getParam('removeDraft');
    const client = navigation.getParam('client');
    const find = drafts.find((draft: ArgumentDraft) => draft.claimId === claimId);

    const summaryText = find && find.summaryText ? find.summaryText : '';
    const argumentText = find && find.argumentText ? find.argumentText : '';

    LoadingBlanketHandler.show();
    try {
      const resp = await Chain.editArgument({
        argumentId,
        summary: summaryText,
        body: argumentText,
      });
      console.log('PUBLISH RESPONSE: ', resp);

      client.query({
        query: ARGUMENT_QUERY,
        variables: { argumentId: argumentId },
        fetchPolicy: 'network-only',
      });

      removeDraft(claimId);
      navigation.dismiss();

      truToastSuccess('Argument edited!');
    } catch (err) {
      console.log(err);
      truToastError(`Your argument edit failed to submit: ${err}`);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 } }>
        <BaseText bold={ true } align={ TextAlign.CENTER }>Review</BaseText>
      </View>
    ),
    headerRight: (
      <BaseButton
        outline={ true }
        color={ Color.APP_PURPLE }
        accentColor={ Color.WHITE }
        style={ { paddingHorizontal: 0, paddingRight: Whitespace.SMALL } }
        title={ edit ? 'Update' : 'Post' }
        onAction={ edit ? onUpdate : onFinish }
        width={ 'auto' }
      />
      ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: Whitespace.SMALL,
    paddingRight: Whitespace.SMALL,
    paddingTop: Whitespace.MEDIUM,
  },
});

const mapStateToProps = (state: any) => {
  return {
    drafts: state.drafts.drafts,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  addDraftVote: (claimId: ID, vote: boolean) => {
    return dispatch(addDraftVote(claimId, vote));
  },
  removeDraft: (claimId: ID) => {
    return dispatch(removeDraft(claimId));
  },
});

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(AddArgumentScreen3));
