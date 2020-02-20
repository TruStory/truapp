import React from 'react';
import { QueryResult, WithApolloClient } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import AppAccountBalanceQuery, { AppAccountBalanceQueryData } from 'shared/graphql/types/AppAccountBalanceQuery';
import { removeClaimDraft } from 'shared/redux/actions/claim-draft.action';
import { ID } from 'shared/types';
import { AddClaimDraft } from 'shared/types/claim';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import ValidationUtil from 'shared/utils/validation';
import AddClaimScreenComponent from 'web/src/components/Claims/AddClaimScreenComponent';
import { Routes } from '../navigation/Routes';
import { generateDocumentTitle } from '../utils';

interface Props extends RouteComponentProps {
  account: Account;
  removeClaimDraft: (tempId: ID) => void;
}

const AddClaimScreen = (props: WithApolloClient<Props>) => {
  const { account, history, removeClaimDraft } = props;

  generateDocumentTitle('Add Claim');

  const onSubmit = async (draft: AddClaimDraft, tempId: ID) => {
    LoadingBlanketHandler.show();
    const { claim, source, communityId } = draft;
    try {
      const resp = await Chain.createClaim({
        body: claim.trim(),
        source: ValidationUtil.prefixUrl(source).trim(),
        communityId,
      });
      console.log('PUBLISH RESPONSE: ', resp);
      Analytics.track(AnalyticsEventsWeb.ClaimCreated, { claimdId : resp.id, community: resp.community_id });
      removeClaimDraft(tempId);
      history.push(`${Routes.CLAIM}${resp.id}`);
    } catch (err) {
      AlertModalHandler.alert('Oops', err.message);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const renderScreen = (result: QueryResult<AppAccountBalanceQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.appAccount) return <ErrorComponent onRefresh={ refetch } />;

    return <AddClaimScreenComponent onSubmit={ onSubmit } />;
  };

  return (
    <AppAccountBalanceQuery query={ APP_ACCOUNT_BALANCE_QUERY } variables={ { id: account.id } }>
      { renderScreen }
    </AppAccountBalanceQuery>
  );
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

const mapDispatchToProps = (dispatch: any) => ({
  removeClaimDraft: (tempId: ID) => {
    return dispatch(removeClaimDraft(tempId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClaimScreen);
