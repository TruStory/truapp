import BigNumber from 'bignumber.js';
import React from 'react';
import { QueryResult } from 'react-apollo';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import AppAccountBalanceQuery, { AppAccountBalanceQueryData } from 'shared/graphql/types/AppAccountBalanceQuery';
import { confirmation_agree } from 'shared/images/Confirmation/ConfirmationImages';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { AppAccount } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';
import { nanosecondsToDays } from 'shared/utils/duration';
import { Routes } from '../../navigation/Routes';

interface Props {
  account?: Account;
  settings: Settings;
  onSubmit: () => void;
  onClose: () => void;
}

const AgreeConfirmationModal = (props: Props) => {

  const { account, onSubmit, onClose, settings } = props;
  let contentJsx: React.ReactNode | React.ReactNode[];

  const { upvoteStake } = settings;

  const renderAccountWidget = (result: QueryResult<AppAccountBalanceQueryData, any>) => {
    const { loading, error, data } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !account || !data.appAccount) {
      contentJsx = (
        <React.Fragment>
          <View style={ { display: 'flex' } }>
            <BaseText>You may only agree with an argument if you are logged in.</BaseText>
          </View>
        </React.Fragment>
      );
    } else if ( new BigNumber(data.appAccount.availableBalance.amount).isLessThan(new BigNumber(upvoteStake.amount)) ) {
      contentJsx = (
        <React.Fragment>
          <View style={ { display: 'flex' } }>
            <BaseText>
              You do not have the required balance of
              { upvoteStake.humanReadable } { settings.stakeDisplayDenom } needed to back or challenge this argument.
            </BaseText>
          </View>
        </React.Fragment>
      );
    } else {

      const appAccount: AppAccount = data.appAccount;
      const onSubmitAction = () => onSubmit();

// tslint:disable: max-line-length
      contentJsx = (
        <React.Fragment>
          <View style={ { flexDirection: 'column', alignItems: 'center' } }>
            <Image source={ confirmation_agree } style={ { width: 275, height: 185, marginBottom: Whitespace.SMALL  } } />
            <BaseText textSize={ TextSize.H3 } align={ TextAlign.CENTER }>
              By Agreeing, you are helping surface the best Arguments!
            </BaseText>
          </View>
          <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
          <View style={ { flexDirection: 'row' } }>
            <BaseText bold={ true } style={ { flex: 1 } }>Your Balance</BaseText>
            <BaseText>{ appAccount.availableBalance.humanReadable } { settings.stakeDisplayDenom }</BaseText>
          </View>
          <View style={ { flexDirection: 'row', marginTop: Whitespace.SMALL } }>
            <BaseText bold={ true } style={ { flex: 1 } } color={ Color.RED }>Deposit</BaseText>
            <BaseText color={ Color.RED }>{ settings.upvoteStake.humanReadable } { settings.stakeDisplayDenom }</BaseText>
          </View>
          <View style={ { marginTop: Whitespace.TINY } }>
            <BaseText textSize={ TextSize.H6 } color={ Color.GRAY }>
              After { nanosecondsToDays(settings.period) } days, you'll be refunded your deposit and earn a reward of { settings.upvoteStakerReward.humanReadable } { settings.stakeDisplayDenom }.
            </BaseText>
          </View>
          <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
          <BaseButton
            onAction={ onSubmitAction }
            title={ `Agree Now!` }
            width={ '100%' }
            color={ Color.WHITE }
            accentColor={ Color.APP_PURPLE }
            outline={ false }
          />
          <View style={ {  alignItems: 'center', marginTop: Whitespace.SMALL } }>
            <BaseATag
              color={ Color.APP_PURPLE }
              textSize={ TextSize.H6 }
              underline={ true }
              target={ '_blank' }
              href={ Routes.HOW_IT_WORKS }
            >
              <BaseText>
                How It Works
              </BaseText>
            </BaseATag>
          </View>
        </React.Fragment>
      );
    }

    return (
      <View style={ { width: 331 } }>
        <View style={ { flexDirection: 'row', alignItems: 'center', flex: 1, marginBottom: Whitespace.LARGE } }>
          <View style={ { flexDirection: 'row', flex: 1, justifyContent: 'center' } }>
            <BaseText
              color={ Color.GREEN }
              textSize={ TextSize.H2 }
              bold={ true }
              style={ { marginRight: -Whitespace.LARGE } }
            >
                Agree
            </BaseText>
          </View>
          <BaseActionable onAction={ onClose } style={ { alignItems: 'flex-end' } }>
            <BaseIconView family={ 'Feather' } name={ 'x' } />
          </BaseActionable>
        </View>
        { contentJsx }
      </View>
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

export default connect(mapStateToProps)(AgreeConfirmationModal)    ;
