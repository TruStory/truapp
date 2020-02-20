import BigNumber from 'bignumber.js';
import React, { ChangeEvent } from 'react';
import { QueryResult } from 'react-apollo';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
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
import { confirmation_not_helpful } from 'shared/images/Confirmation/ConfirmationImages';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import { Settings } from 'shared/types/settings';
import { SlashArgumentReason } from 'shared/types/slashing';
import { toastOptions } from 'shared/utils/toast';
import BaseTextArea from 'web/src/components/Base/BaseTextArea';
import { Routes } from '../../navigation/Routes';
import SlashArgumentOptions from '../Slashing/SlashArgumentOptions';

interface Props {
  argument: Argument;
  account?: Account;
  settings: Settings;
  onSubmit: (argument: Argument, reason: SlashArgumentReason, reasonText: string) => void;
  onClose: () => void;
}

const FlagConfirmationModal = (props: Props) => {

  const { account, onSubmit, onClose, argument, settings } = props;
  let contentJsx: React.ReactNode | React.ReactNode[];
  const [ reason, setReason ] = React.useState(-1);
  const [ reasonText, setReasonText ] = React.useState('');

  const { slashMinStake } = settings;

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => setReasonText(e.target.value);

  const renderAccountWidget = (result: QueryResult<AppAccountBalanceQueryData, any>) => {
    const { loading, error, data } = result;
    if (loading) return <BaseLoadingIndicator />;

    if (error || !data || !account || !data.appAccount) {
      contentJsx = (
        <React.Fragment>
          <View style={ { display: 'flex' } }>
            <BaseText>You may only downvote this Argument if you are logged in.</BaseText>
          </View>
        </React.Fragment>
      );
    } else if ( new BigNumber(data.appAccount.earnedBalance.amount).isLessThan(new BigNumber(slashMinStake.amount)) ) {
      contentJsx = (
        <React.Fragment>
          <View style={ { display: 'flex' } }>
            <BaseText>
              To downvote an Argument, you must have earned at least { slashMinStake.humanReadable } { settings.stakeDisplayDenom }.
            </BaseText>
          </View>
        </React.Fragment>
      );
    } else {
      const onSubmitAction = () => {
        if (reason === -1) {
          toast.error('Please select a reason', toastOptions);
          return;
        }
        onSubmit(argument, reason, reasonText);
      };
      const onChangeDropdown = (reason: SlashArgumentReason) => setReason(reason);

// tslint:disable: max-line-length
      contentJsx = (
      <React.Fragment>
        <View style={ { flexDirection: 'column', alignItems: 'center' } }>
          <Image source={ confirmation_not_helpful } style={ { width: 275, height: 200, marginBottom: Whitespace.SMALL  } } />
          <BaseText textSize={ TextSize.H3 } align={ TextAlign.CENTER }>You are about to remove a low-quality Argument.</BaseText>
          <View style={ { zIndex: 1000 } }>
            <BaseText
              textSize={ TextSize.H6 }
              style={ { marginTop: Whitespace.SMALL } }
            >
              Tell Us Why
            </BaseText>
            <SlashArgumentOptions
              value={ reason }
              onChange={ onChangeDropdown }
              style={ { marginTop: Whitespace.TINY } }
            />
          </View>
        </View>
        <BaseLine style={ { marginTop: Whitespace.MEDIUM } } />
        <div style={ {  display: ( reason === SlashArgumentReason.Other ? 'flex' : 'none' ) }  }>
          <BaseTextArea
            placeholder={ `What's your reason?` }
            value={ reasonText }
            onChange={ onChangeInput }
            style={ styles.input }
          />
        </div>
        <BaseButton
          onAction={ onSubmitAction }
          title={ `Submit` }
          width={ '100%' }
          color={ Color.WHITE }
          accentColor={ Color.APP_PURPLE }
          outline={ false }
          style={ { marginTop: Whitespace.MEDIUM } }
        />
        <View style={ {  alignItems: 'center', marginTop: Whitespace.SMALL } }>
          <BaseATag
            color={ Color.APP_PURPLE }
            textSize={ TextSize.H6 }
            underline={ true }
            target={ '_blank' }
            href={ Routes.HOW_IT_WORKS }
          >
            How It Works
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
            color={ Color.RED }
            textSize={ TextSize.H2 }
            bold={ true }
            style={ { marginRight: -Whitespace.LARGE } }
          >
              Downvote
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

const styles = {
  input: {
    borderBottom: `1px solid ${Color.LINE_GRAY}`,
    paddingBottom: Whitespace.SMALL,
    marginTop: Whitespace.TINY,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(FlagConfirmationModal);
