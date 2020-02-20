import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { View } from 'react-native';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import APP_ACCOUNT_HOVER_QUERY from 'shared/graphql/queries/app-account-hover.query';
import AppAccountHoverQuery, { AppAccountHoverQueryData } from 'shared/graphql/types/AppAccountHoverQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Address } from 'shared/types/appAccount';
import CommunityHoverCoinList from '../Communities/CommunityHoverCoinList';

interface Props {
  appAccountId: Address;
}

const AppAccountHover: React.FunctionComponent<Props> = (props: Props) => {
  const { appAccountId } = props;

  const renderProfile = (result: QueryResult<AppAccountHoverQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <div style={ styles.loadingContainer }><BaseLoadingIndicator /></div>;
    if (error || !data || !data.appAccount) return <div style={ styles.loadingContainer }><ErrorComponent onRefresh={ refetch } /></div>;
    const { appAccount } = data;

    return (
      <div style={ styles.container }>
        <View style={ { flexDirection: 'row', alignItems: 'center' } }>
          <AppAccountAvatar appAccount={ appAccount } avatarSize={ AvatarSize.XLARGE } />
          <BaseText bold={ true } color={ Color.APP_BLACK }>
            { appAccount.userProfile.username }
          </BaseText>
        </View>
        <BaseLine style={ { marginTop: Whitespace.SMALL, marginBottom: Whitespace.TINY } } />
        <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
          <View style={ { alignItems: 'flex-start' } }>
            <BaseText textSize={ TextSize.H3 } bold={ true }>{ appAccount.earnedBalance.humanReadable }</BaseText>
            <BaseText textSize={ TextSize.H6 }>Earnings</BaseText>
          </View>
          <View style={ { alignItems: 'flex-start' } }>
            <BaseText textSize={ TextSize.H3 } bold={ true }>{ appAccount.totalArguments }</BaseText>
            <BaseText textSize={ TextSize.H6 }>Arguments</BaseText>
          </View>
          <View style={ { alignItems: 'flex-start' } }>
            <BaseText textSize={ TextSize.H3 } bold={ true }>{ appAccount.totalAgrees }</BaseText>
            <BaseText textSize={ TextSize.H6 }>Agrees</BaseText>
          </View>
          <View style={ { alignItems: 'flex-start' } }>
            <BaseText textSize={ TextSize.H3 } bold={ true }>{ appAccount.totalClaims }</BaseText>
            <BaseText textSize={ TextSize.H6 }>Claims</BaseText>
          </View>
        </View>
        <BaseLine style={ { marginTop: Whitespace.SMALL, marginBottom: Whitespace.SMALL } } />
        <View style={ { display: 'flex', flexDirection: 'column' } }>
          <CommunityHoverCoinList
            communityCoins={ appAccount.earnedStake }
          />
        </View>
      </div>
    );
  };

  return (
    <AppAccountHoverQuery query={ APP_ACCOUNT_HOVER_QUERY } variables={ { id: appAccountId } }>
      { renderProfile }
    </AppAccountHoverQuery>
  );
};

const styles = {
  container: {
    minWidth: 275,
    borderRadius: Whitespace.MEDIUM,
    padding: `${Whitespace.MEDIUM}px ${Whitespace.MEDIUM}px`,
    backgroundColor: Color.WHITE,
    alignItems: 'center',
  },
  loadingContainer : {
    width: 275,
    borderRadius: Whitespace.MEDIUM,
    padding: `${Whitespace.MEDIUM}px ${Whitespace.MEDIUM}px`,
    backgroundColor: Color.WHITE,
    height: 170,
    alignItems: 'center',
  },
};

export default AppAccountHover;
