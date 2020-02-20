import AppAccountScreenComponent from 'mobile/src/components/AppAccount/AppAccountScreenComponent';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import APP_ACCOUNT_PROFILE_QUERY from 'shared/graphql/queries/app-account-profile.query';
import AppAccountProfileQuery, { AppAccountProfileQueryData } from 'shared/graphql/types/AppAccountProfileQuery';
import { isIphoneX } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, any>;
  account?: Account;
}

const UserAppAccountScreen = (props: Props) => {
  const { account } = props;

  if (!account)
    return null;

  const renderScreen = (result: QueryResult<AppAccountProfileQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    const { appAccount } = data;

    return (
      <AppAccountScreenComponent
        appAccountDetails={ appAccount }
        style={ { paddingTop: isIphoneX() ? Whitespace.MEDIUM * 4 : Whitespace.MEDIUM } }
      />
    );
  };

  return (
    <AppAccountProfileQuery query={ APP_ACCOUNT_PROFILE_QUERY } variables={ { id: account.id } }>
      { renderScreen }
    </AppAccountProfileQuery>
  );

};

UserAppAccountScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  return {
    header: null,
    title: ' ',
  };
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(UserAppAccountScreen);
