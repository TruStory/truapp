import React, { CSSProperties } from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import TruTip from 'shared/components/WebOnly/TruTip';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import AppAccountBalanceQuery, { AppAccountBalanceQueryData } from 'shared/graphql/types/AppAccountBalanceQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Address, AppAccount } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';

interface Props {
  settings: Settings;
  appAccountId: Address;
  style?: StyleProp<ViewStyle> & CSSProperties;
}

const BalanceWidget = (props: Props) => {

  const { settings, appAccountId, style } = props;

  const renderAccountWidget = (result: QueryResult<AppAccountBalanceQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.appAccount) return <ErrorComponent onRefresh={ refetch } />;
    const appAccount: AppAccount = data.appAccount;

    // tslint:disable: max-line-length
    return (
      <View style={ [ styles.container, style ] }>
        <BaseText bold={ true } style={ { marginBottom: Whitespace.SMALL } }>My { settings.stakeDisplayDenom }</BaseText>
        <TruTip
          tip={ { title: 'Current Balance' , subtitle: `${ settings.stakeDisplayDenom } is your in-game currency. It is used as "skin in the game" to write new arguments or surface high-quality ones.` } }
          clickable={ false }
        >
          <View style={ styles.container }>
            <BaseText color={ Color.APP_PURPLE } bold={ true }>{ appAccount.availableBalance.humanReadable }</BaseText>
            <BaseText style={ { paddingBottom: Whitespace.SMALL } } textSize={ TextSize.H5 }>Current Balance</BaseText>
          </View>
        </TruTip>
        <TruTip
          tip={ { title: 'Total Earned' , subtitle: `You earn ${ settings.stakeDisplayDenom } by writing and surfacing the best Arguments. You lose ${ settings.stakeDisplayDenom } for writing and surfacing low-quality Arguments.` } }
          clickable={ false }
        >
          <View style={ styles.container }>
            <BaseText color={ Color.APP_PURPLE } bold={ true }>{ appAccount.earnedBalance.humanReadable }</BaseText>
            <BaseText textSize={ TextSize.H5 }>Total Earned</BaseText>
          </View>
        </TruTip>
      </View>
    );

  };

  return (
    <AppAccountBalanceQuery query={ APP_ACCOUNT_BALANCE_QUERY } variables={ { id: appAccountId } }>
      { renderAccountWidget }
    </AppAccountBalanceQuery>
  );

};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(BalanceWidget);
