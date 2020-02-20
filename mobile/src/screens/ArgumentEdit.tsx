import { Routes } from 'mobile/src/navigation/Routes';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import ARGUMENT_QUERY from 'shared/graphql/queries/argument.query';
import ArgumentQuery, { ArgumentQueryData } from 'shared/graphql/types/ArgumentQuery';
import { edit_black } from 'shared/images/Edit/EditImages';
import { addDraftArgument, addDraftSummary, removeDraft } from 'shared/redux/actions/argument-draft.action';
import { ArgumentDraft } from 'shared/redux/reducers/argument-draft.reducer';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { IconSize, Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';

interface Props extends NavigationScreenProps {
  argumentId: ID;
  navigation: NavigationScreenProp<any, any>;
  account?: Account;
  settings: Settings;
  removeDraft: (claimId: ID) => void;
  addDraftArgument: (claimId: ID, argumentText: string) => void;
  addDraftSummary: (claimId: ID, summaryText: string) => void;
  drafts: ArgumentDraft[];
}

const ArgumentEdit = (props: Props) => {
  const { navigation, settings, argumentId, account, drafts, removeDraft, addDraftArgument, addDraftSummary } = props;
  const [ modalVisible, setModalVisible ] = React.useState(false);

  if (!account)
    return null;

  const renderScreen = (result: QueryResult<ArgumentQueryData, any>) => {
    const { loading, error, data } = result;

    if (loading || error || !data || !data.claimArgument) return null;
    const { claimArgument } = data;

    if (!claimArgument.isUnhelpful &&
      ((claimArgument.creator.id === account.id && claimArgument.stakers.length === 0) || settings.stakingAdmins.includes(account.id) )) {

      const onSetupArgumentPages = () => {

        const find = drafts.find((draft: ArgumentDraft) => draft.claimId === claimArgument.claimId);
        if (find && find.argumentText) {
          setModalVisible(true);
        } else {
          setupDrafts();
          onNavigate();
        }
      };

      const onNavigate = () => {
        setModalVisible(false);
        navigation.navigate(Routes.AddArgumentStack, { claimId: claimArgument.claimId, settings, edit: true, argumentId: claimArgument.id });
      };

      const setupDrafts = () => {
        addDraftArgument(claimArgument.claimId, claimArgument.body);
        addDraftSummary(claimArgument.claimId, claimArgument.summary);
      };

      const onStartFresh = () => {
        removeDraft(claimArgument.claimId);
        setupDrafts();
        onNavigate();
      };

      return (
        <React.Fragment>
          <BaseActionable
            onAction={ onSetupArgumentPages }
          >
            <BaseIconImageView  source={ edit_black } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } />
          </BaseActionable>
          <ActionSheet visible={ modalVisible } onCancel={ () => setModalVisible(false) }>
            <View style={ { backgroundColor: Color.WHITE, padding: Whitespace.SMALL, paddingBottom: actionSheetBottomPadding } }>
              <BaseText bold={ true }>You have an edited argument of this draft that you started before. Would you like to resume editing or start a fresh edit?</BaseText>
              <BaseActionable style={ styles.rowContainer } onAction={ onNavigate }>
                <BaseIconView name={ 'edit' } style={ { marginRight: Whitespace.TINY } } size={ IconSize.XSMALL } />
                <BaseText>Resume Editing</BaseText>
              </BaseActionable>
              <BaseLine />
              <BaseActionable style={ styles.rowContainer } onAction={ onStartFresh }>
                <BaseIconView name={ 'edit-2' } style={ { marginRight: Whitespace.TINY } } size={ IconSize.XSMALL } />
                <BaseText>Start Fresh Edit</BaseText>
              </BaseActionable>
            </View>
          </ActionSheet>
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <ArgumentQuery query={ ARGUMENT_QUERY } variables={ { argumentId } }>
      { renderScreen }
    </ArgumentQuery>
  );
};

const styles = StyleSheet.create({
  container: { },
  rowContainer: { padding: Whitespace.LARGE, paddingLeft: Whitespace.TINY, flexDirection: 'row', alignItems: 'center' },
});

const mapStateToProps = (state: any) => ({
  account :  state.auth.account,
  settings: state.settings.settings,
  drafts: state.drafts.drafts,
});

const mapDispatchToProps = (dispatch: any) => ({
  addDraftArgument: (claimId: ID, argumentText: string) => {
    return dispatch(addDraftArgument(claimId, argumentText));
  },
  addDraftSummary: (claimId: ID, summaryText: string) => {
    return dispatch(addDraftSummary(claimId, summaryText));
  },
  removeDraft: (claimId: ID) => {
    return dispatch(removeDraft(claimId));
  },
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ArgumentEdit));
