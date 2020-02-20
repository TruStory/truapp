import BigNumber from 'bignumber.js';
import React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseCard, { CardOption } from 'shared/components/Base/BaseCard';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import AppAccountBalanceQuery, { AppAccountBalanceQueryData } from 'shared/graphql/types/AppAccountBalanceQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import { Settings } from 'shared/types/settings';
import { nanosecondsToDays } from 'shared/utils/duration';

interface Props {
  argument: Argument;
  account: Account;
  settings: Settings;
  onSubmit: () => void;
  onClose: () => void;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const AgreeConfirmationModal = (props: Props) => {

  const { account, onSubmit, settings, argument, onClose, style } = props;

  const renderAccountWidget = (result: QueryResult<AppAccountBalanceQueryData, any>) => {
    const { loading, error, data } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.appAccount) {
      return (
        <BaseCard radius={ CardOption.TOP } margin={ CardOption.NONE }>
          <View style={ { display: 'flex' } }>
            <BaseText>You may only agree with an argument if you are logged in.</BaseText>
          </View>
        </BaseCard>
      );
    } else if ( new BigNumber(data.appAccount.availableBalance.amount).isLessThan(new BigNumber(settings.upvoteStake.amount)) ) {
      return (
        <BaseCard radius={ CardOption.TOP } margin={ CardOption.NONE }>
          <BaseText>
            You do not have the required balance of { settings.argumentCreationStake.humanReadable }
            { settings.stakeDisplayDenom } needed to back or challenge this argument.
          </BaseText>
        </BaseCard>
      );
    } else {

      const onSubmitAction = () => onSubmit();

      return (
        <BaseCard radius={ CardOption.TOP } margin={ CardOption.NONE } style={ style }>
          <View style={ { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Whitespace.MEDIUM } }>
            <BaseText textSize={ TextSize.H3 } bold={ true } style={ { flex: 1 } }>Confirm</BaseText>
            <BaseActionable onAction={ onClose }>
              <BaseIconView family={ 'Feather' } name={ 'x' } />
            </BaseActionable>
          </View>
          <BaseCard radius={ CardOption.AROUND } margin={ CardOption.NONE } shadow={ CardOption.AROUND }>
            <View style={ { flexDirection: 'row', alignItems: 'center', marginBottom: Whitespace.SMALL } }>
              <BaseText color={ Color.APP_PURPLE } style={ { flex: 1, paddingRight: Whitespace.LARGE * 2 } } bold={ true }>
                Agreeing with { argument.creator.userProfile.username }
              </BaseText>
              <AppAccountAvatar appAccount={ argument.creator } avatarSize={ AvatarSize.XXLARGE }  />
            </View>
            <ArgumentSummaryText summary={ argument.summary } />
          </BaseCard>
          <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
          <View style={ { flexDirection: 'row' } }>
            <BaseText bold={ true } style={ { flex: 1 } }>Your Balance</BaseText>
            <BaseText>{ data.appAccount.availableBalance.humanReadable } { settings.stakeDisplayDenom }</BaseText>
          </View>
          <View style={ { flexDirection: 'row', marginTop: Whitespace.SMALL } }>
            <BaseText bold={ true } style={ { flex: 1 } } color={ Color.RED }>Deposit</BaseText>
            <BaseText color={ Color.RED }>{ settings.upvoteStake.humanReadable } { settings.stakeDisplayDenom }</BaseText>
          </View>
          <BaseLine style={ { marginVertical: Whitespace.LARGE } } />
          <View>
            <BaseText textSize={ TextSize.H6 } color={ Color.GRAY }>
              After { nanosecondsToDays(settings.period) } days, you'll be refunded your deposit and earn a reward of { settings.upvoteStakerReward.humanReadable } { settings.stakeDisplayDenom }.
            </BaseText>
          </View>
          <BaseButton
            title={ 'Agree' }
            onAction={ onSubmitAction }
            outline={ false }
            style={ { width: '100%', marginTop: Whitespace.LARGE } }
            accentColor={ Color.APP_PURPLE }
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

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(AgreeConfirmationModal);
