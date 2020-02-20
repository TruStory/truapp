import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { match, RouteComponentProps } from 'react-router';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import APP_ACCOUNT_PROFILE_QUERY from 'shared/graphql/queries/app-account-profile.query';
import AppAccountProfileQuery, { AppAccountProfileQueryData } from 'shared/graphql/types/AppAccountProfileQuery';
import AppAccountScreenComponent from 'web/src/components/AppAccount/AppAccountScreenComponent';
import { generateDocumentTitle } from '../utils';

interface Params {
  id?: string;
}
interface Props extends RouteComponentProps {
  match: match<Params>;
}

const AppAccountScreen = (props: Props) => {
  const { match } = props;
  const accountId = match.params.id ? match.params.id : '';

  generateDocumentTitle('Profile');

  const renderScreen = (result: QueryResult<AppAccountProfileQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    const { appAccount } = data;

    generateDocumentTitle(`${appAccount.userProfile.username}'s Profile`);

    return (
      <AppAccountScreenComponent
        appAccountDetails={ appAccount }
      />
    );
  };

  return (
    <AppAccountProfileQuery query={ APP_ACCOUNT_PROFILE_QUERY } variables={ { id: accountId } }>
      { renderScreen }
    </AppAccountProfileQuery>
  );

};

export default AppAccountScreen;
