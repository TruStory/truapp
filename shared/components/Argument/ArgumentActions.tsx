import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import { CodeType } from 'shared/blockchain/errors';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import AppAccountAvatarsPreview from 'shared/components/AppAccount/AppAccountAvatarsPreview';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import AgreeConfirmationModal from 'shared/components/Modals/AgreeConfirmationModal';
import FlagConfirmationModal from 'shared/components/Modals/FlagConfirmationModal';
import OutOfTruModal from 'shared/components/Modals/OutOfTruModal';
import StakingLimitModal from 'shared/components/Modals/StakingLimitModal';
import NativeShareSheet from 'shared/components/Share/NativeShareSheet';
import { truToastError, truToastSuccess } from 'shared/components/Toast/TruToast';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import ARGUMENT_QUERY from 'shared/graphql/queries/argument.query';
import CLAIM_QUERY from 'shared/graphql/queries/claim.query';
import { agree_gray, agree_purple, down_gray, down_purple, share_gray } from 'shared/images/ArgumentActions/ArgumentActionsImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import { SlashArgumentReason, SlashType } from 'shared/types/slashing';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';

interface Props {
  account?: Account;
  argument: Argument;
  client?: any;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ArgumentActions = (props: WithApolloClient<Props>) => {
  const { account, argument, style, client } = props;
  const { upvotedCount, downvotedCount, appAccountStake, appAccountSlash, isUnhelpful } = argument;
  const [ modalVisible, setModalVisible ] = React.useState(false);
  const [ notHelpfulModalVisible, setNotHelpfulModalVisible ] = React.useState(false);
  const [ outOfTruModalVisible, setOutOfTruModalVisible ] = React.useState(false);
  const [ stakingLimitModalVisible, setStakingLimitModalVisible ] = React.useState(false);

  const onSubmitAgree = async () => {
    setModalVisible(false);
    LoadingBlanketHandler.show();

    try {
      const resp = await Chain.submitUpvote({
        argumentId: argument.id,
      });
      const trackProperties = { argumentId: argument.id, claimId: argument.claimId, community: argument.communityId };
      Analytics.track(AnalyticsEventsMobile.AgreeSentSuccessfully, trackProperties);
      console.log('PUBLISH RESPONSE: ', resp);
      client.query({
        query: ARGUMENT_QUERY,
        variables: { argumentId: argument.id },
        fetchPolicy: 'network-only',
      });
      client.query({
        query: CLAIM_QUERY,
        variables: { claimId: argument.claimId },
        fetchPolicy: 'network-only',
      });
      if (account !== undefined) {
        client.query({
          query: APP_ACCOUNT_BALANCE_QUERY,
          variables: { id: account.address },
          fetchPolicy: 'network-only',
        });
      }
    } catch (err) {
      if (err.code === CodeType.CodeMinBalance) {
        setOutOfTruModalVisible(true);
      } else if (err.code === CodeType.CodeMaxAmountStakingReached) {
        setStakingLimitModalVisible(true);
      } else {
        truToastError(`Your agree could not be submitted: ${err.message}`);
      }
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const onAgreeAction = () => {
    if (appAccountStake) {
      truToastError('You have already Agreed with this Argument');
      return;
    }
    if (isUnhelpful) {
      truToastError('This Argument has been downvoted, so no further action can be performed on it. Sorry!');
      return;
    }
    setModalVisible(true);
  };

  const onNotHelpfulAction = () => {
    if (appAccountSlash) {
      truToastError('You have already downvoted this Argument');
      return;
    }
    if (appAccountStake !== null) {
      truToastError('You have already agreed with this Argument');
      return;
    }
    if (isUnhelpful) {
      truToastError('This Argument has been downvoted, so no further action can be performed on it. Sorry!');
      return;
    }
    setNotHelpfulModalVisible(true);
  };

  const onSubmitNotHelpful = async (reason: SlashArgumentReason, reasonText: string) => {
    setNotHelpfulModalVisible(false);
    LoadingBlanketHandler.show();

    try {

      const resp = await Chain.slashArgument({
        argument_id: argument.id,
        slash_type: SlashType.SlashTypeUnhelpful,
        slash_reason: reason,
        slash_detailed_reason: reasonText,
      });
      console.log('PUBLISH RESPONSE: ', resp);

      truToastSuccess('Thanks for downvoting this Argument!');

      client.query({
        query: ARGUMENT_QUERY,
        variables: { argumentId: argument.id },
        fetchPolicy: 'network-only',
      });
      if (account !== undefined) {
        client.query({
          query: APP_ACCOUNT_BALANCE_QUERY,
          variables: { id: account.address },
          fetchPolicy: 'network-only',
        });
      }
    } catch (err) {
      truToastError(`Oops there was an error trying to downvote this Argument: ${err}`);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const viewStyle: any = { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' };
  if (argument.stakers.length === 0) {
    viewStyle.width = (Dimensions.get('screen').width - 22 * 2) * 0.75;
  } else {
    viewStyle.flex = 1;
  }

  const renderAvatars = () => {
    if (argument.stakers.length === 0)
      return null;

    const numberText =  argument.stakers.length - 1;
    return (
      <View style={ { flexDirection: 'row', alignItems: 'center' } }>
        <AppAccountAvatarsPreview
          creators={ argument.stakers }
          avatarCount={ 1 }
        />
        { numberText > 0 && <BaseText textSize={ TextSize.H6 } color={ Color.GRAY }>+{ numberText } more</BaseText> }
      </View>
    );

  };

  // tslint:disable: max-line-length
  return(
    <View style={ [ styles.container, style ] }>
      <View style={ viewStyle }>
        <BaseActionable
          disabled={ appAccountSlash !== null }
          onAction={ onAgreeAction }
          style={ { opacity: appAccountSlash ? 0.3 : 1, flexDirection: 'row', display: 'flex', alignItems: 'center' } }
        >
          <BaseIconImageView size={ IconSize.XSMALL } style={ { marginRight: Whitespace.TINY } } source={ appAccountStake ? agree_purple : agree_gray } />
          <BaseText
            color={ appAccountStake ? Color.APP_PURPLE : Color.GRAY }
          >
            { upvotedCount }
          </BaseText>
        </BaseActionable>
        <BaseActionable
          onAction={ onNotHelpfulAction }
          style={ { opacity: appAccountSlash ? 0.3 : 1, flexDirection: 'row', display: 'flex', alignItems: 'center' } }
        >
          <BaseIconImageView size={ IconSize.XSMALL } style={ { marginRight: Whitespace.TINY } } source={ appAccountSlash ? down_purple : down_gray } />
          <BaseText
            color={ appAccountSlash ? Color.APP_PURPLE : Color.GRAY }
          >
            { downvotedCount }
          </BaseText>
        </BaseActionable>
        <NativeShareSheet
          message={ `${AppConfig.base_url}${AppConfig.share_route_urls.claim}${argument.claimId}${AppConfig.share_route_urls.argument}${argument.id}` }
        >
          <BaseIconImageView size={ IconSize.XSMALL } source={ share_gray } />
        </NativeShareSheet>
        { renderAvatars() }
      </View>
      <ActionSheet visible={ modalVisible } onCancel={ () => setModalVisible(false) }>
        <AgreeConfirmationModal
          onSubmit={ () => onSubmitAgree() }
          argument={ argument }
          onClose={ () => setModalVisible(false) }
          style={ { paddingBottom: actionSheetBottomPadding } }
        />
      </ActionSheet>
      <ActionSheet visible={ notHelpfulModalVisible } onCancel={ () => setNotHelpfulModalVisible(false) }>
        <FlagConfirmationModal
          onSubmit={ onSubmitNotHelpful }
          argument={ argument }
          onClose={ () => setNotHelpfulModalVisible(false) }
          style={ { paddingBottom: actionSheetBottomPadding } }
        />
      </ActionSheet>
      <ActionSheet visible={ outOfTruModalVisible } onCancel={ () => setOutOfTruModalVisible(false) }>
        <OutOfTruModal onClose={ () => setOutOfTruModalVisible(false) } />
      </ActionSheet>
      <ActionSheet visible={ stakingLimitModalVisible } onCancel={ () => setStakingLimitModalVisible(false) }>
        <StakingLimitModal onClose={ () => setStakingLimitModalVisible(false) } />
      </ActionSheet>
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flex: 1 },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(withApollo(ArgumentActions));
