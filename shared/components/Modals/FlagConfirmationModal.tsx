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
import SlashArgumentOptions from 'shared/components/Slashing/SlashArgumentOptions';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import AppAccountBalanceQuery, { AppAccountBalanceQueryData } from 'shared/graphql/types/AppAccountBalanceQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import { Settings } from 'shared/types/settings';
import { SlashArgumentReason } from 'shared/types/slashing';

interface Props {
  argument: Argument;
  account: Account;
  settings: Settings;
  onSubmit: (reason: SlashArgumentReason, reasonText: string) => void;
  onClose: () => void;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const FlagConfirmationModal = (props: Props) => {

  const { account, onSubmit, settings, argument, onClose, style } = props;
  const [ reason, setReason ] = React.useState(-1);
  let contentJsx;
  // const [ reasonText, setReasonText ] = React.useState('');

  const renderAccountWidget = (result: QueryResult<AppAccountBalanceQueryData, any>) => {
    const { loading, error, data } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.appAccount) {
      contentJsx = (
          <View style={ { display: 'flex' } }>
            <BaseText>You may only agree with an argument if you are logged in.</BaseText>
          </View>
      );
    } else if ( new BigNumber(data.appAccount.earnedBalance.amount).isLessThan(new BigNumber(settings.slashMinStake.amount)) ) {
      contentJsx = (
        <BaseText style={ { marginBottom: Whitespace.LARGE } }>
          You do not have the required balance of
          { ` ${settings.argumentCreationStake.humanReadable} ${settings.stakeDisplayDenom}` } needed to downvote this argument.
        </BaseText>
      );
    } else {
      const onSubmitAction = () => onSubmit(reason, '');

      // const renderReasonInput = () => {
      //   if (reason === SlashArgumentReason.Other) {
      //     return (
      //       <TextInput
      //         multiline={ true }
      //         style={ styles.input }
      //         onChangeText={ (text: string) => setReasonText(text) }
      //         value={ reasonText }
      //         placeholder={ `What's the claim?` }
      //         autoFocus={ true }
      //       />
      //     );
      //   }
      //   return null;
      // };

      contentJsx = (
        <React.Fragment>
          <BaseCard radius={ CardOption.AROUND } margin={ CardOption.NONE } shadow={ CardOption.AROUND }>
            <View style={ { flexDirection: 'row', alignItems: 'center', marginBottom: Whitespace.SMALL } }>
              <BaseText color={ Color.RED } style={ { flex: 1 } } bold={ true }>
                Downvote { argument.creator.userProfile.username }'s Argument
              </BaseText>
              <AppAccountAvatar appAccount={ argument.creator } avatarSize={ AvatarSize.XXLARGE }  />
            </View>
            <ArgumentSummaryText summary={ argument.summary } />
          </BaseCard>
          <BaseLine style={ { marginTop: Whitespace.MEDIUM } } />
          <SlashArgumentOptions value={ reason } onChange={ (reason: SlashArgumentReason) => setReason(reason) }  />
          <BaseButton
            title={ 'Downvote' }
            onAction={ onSubmitAction }
            outline={ false }
            style={ { width: '100%', marginTop: Whitespace.LARGE, marginBottom: Whitespace.MEDIUM } }
            accentColor={ Color.RED }
            color={ Color.WHITE }
          />
        </React.Fragment>
      );
    }

    return (
      <BaseCard radius={ CardOption.TOP } margin={ CardOption.NONE } style={ style }>
        <View style={ { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Whitespace.MEDIUM } }>
          <BaseText textSize={ TextSize.H3 } bold={ true } style={ { flex: 1 } }>Confirm</BaseText>
          <BaseActionable onAction={ onClose }>
            <BaseIconView family={ 'Feather' } name={ 'x' } />
          </BaseActionable>
        </View>
        { contentJsx }
      </BaseCard>
    );
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

export default connect(mapStateToProps)(FlagConfirmationModal);
