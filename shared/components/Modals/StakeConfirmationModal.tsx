import BigNumber from 'bignumber.js';
import React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseCard, { CardOption } from 'shared/components/Base/BaseCard';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import AppAccountBalanceQuery, { AppAccountBalanceQueryData } from 'shared/graphql/types/AppAccountBalanceQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';

interface Props {
  account: Account;
  settings: Settings;
  vote: boolean;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  onSubmit: () => void;
  onClose?: () => void;
  onUpdateVote: (vote: boolean) => void;
}

const StakeConfirmationModal = (props: Props) => {

  const { account, onSubmit, vote, settings, onUpdateVote, style } = props;

  const renderAccountWidget = (result: QueryResult<AppAccountBalanceQueryData, any>) => {
    const { loading, error, data } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !account || !data.appAccount) {
      return (
        <BaseCard radius={ CardOption.TOP } margin={ CardOption.NONE }>
          <View style={ { display: 'flex' } }>
            <BaseText>You may only write an argument if you are logged in.</BaseText>
          </View>
        </BaseCard>
      );
    } else if ( new BigNumber(data.appAccount.availableBalance.amount).isLessThan(new BigNumber(settings.argumentCreationStake.amount)) ) {
      return (
        <BaseCard radius={ CardOption.TOP } margin={ CardOption.NONE }>
          <View style={ { display: 'flex' } }>
            <BaseText>
              You do not have the required balance of { settings.argumentCreationStake.humanReadable }
              { settings.stakeDisplayDenom } needed to back or challenge this argument.
            </BaseText>
          </View>
        </BaseCard>
      );
    } else {

      const onSubmitAction = () => onSubmit();

      return (
        <BaseCard radius={ CardOption.TOP } margin={ CardOption.NONE } style={ style }>
          <BaseText textSize={ TextSize.H3 } bold={ true }>What's your stance?</BaseText>
          <BaseActionable style={ styles.option } onAction={ () => onUpdateVote(true) }>
            <View style={ { flexDirection: 'column', flex: 1 } }>
              <BaseText textSize={ TextSize.H3 } bold={ true }>Back</BaseText>
              <BaseText textSize={ TextSize.H5 } color={ Color.GRAY }>
                I back this claim with { settings.argumentCreationStake.humanReadable } { settings.stakeDisplayDenom }
              </BaseText>
            </View>
            <BaseIconView
              name={ vote ? 'check-circle' : 'radio-button-unchecked' }
              color={ vote ? Color.BACK : Color.APP_BLACK }
              family={ IconFamily.MATERIAL }
            />
          </BaseActionable>
          <BaseActionable style={ styles.option } onAction={ () => onUpdateVote(false) }>
            <View style={ { flexDirection: 'column', flex: 1 } }>
              <BaseText textSize={ TextSize.H3 } bold={ true }>Challenge</BaseText>
              <BaseText textSize={ TextSize.H5 } color={ Color.GRAY }>
                I challenge this claim with { settings.argumentCreationStake.humanReadable } { settings.stakeDisplayDenom }.
              </BaseText>
            </View>
            <BaseIconView
              name={ vote ? 'radio-button-unchecked' : 'check-circle' }
              color={ vote ? Color.APP_BLACK : Color.CHALLENGE }
              family={ IconFamily.MATERIAL }
            />
          </BaseActionable>
          <BaseButton
            title={ `I ${ vote ? 'Back' : 'Challenge'} This Claim` }
            onAction={ onSubmitAction }
            outline={ false }
            style={ { width: '100%', marginTop: Whitespace.LARGE, marginBottom: Whitespace.MEDIUM } }
            accentColor={ vote ? Color.BACK : Color.CHALLENGE }
            color={ Color.WHITE }
          />
        </BaseCard>
      );
    }
  };

  return (
    <AppAccountBalanceQuery query={ APP_ACCOUNT_BALANCE_QUERY } variables={ { id: account ? account.id : '' } }>
      { renderAccountWidget }
    </AppAccountBalanceQuery>
  );
};

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Whitespace.LARGE },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(StakeConfirmationModal);
