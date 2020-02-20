import AppAccountScreenComponent from 'mobile/src/components/AppAccount/AppAccountScreenComponent';
import { headerStyles } from 'mobile/src/styles';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import APP_ACCOUNT_PROFILE_QUERY from 'shared/graphql/queries/app-account-profile.query';
import AppAccountProfileQuery, { AppAccountProfileQueryData } from 'shared/graphql/types/AppAccountProfileQuery';
import { Whitespace } from 'shared/styles/views';
import { Address } from 'shared/types/appAccount';

interface NavigationParams {
  accountId: Address;
  username: string;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const AppAccountScreen = (props: Props) => {
  const { navigation } = props;
  const accountId = navigation.getParam('accountId');

  const renderScreen = (result: QueryResult<AppAccountProfileQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    const { appAccount } = data;

    return (
      <AppAccountScreenComponent appAccountDetails={ appAccount } style={ { paddingTop: Whitespace.MEDIUM } } />
    );
  };

  return (
    <AppAccountProfileQuery query={ APP_ACCOUNT_PROFILE_QUERY } variables={ { id: accountId } }>
      { renderScreen }
    </AppAccountProfileQuery>
  );

};

AppAccountScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams>}) => {
  return {
    ...headerStyles,
    title: '',
  };
};

export default AppAccountScreen;
