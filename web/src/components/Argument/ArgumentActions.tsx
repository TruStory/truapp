import { ApolloClient } from 'apollo-boost';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import { CodeType } from 'shared/blockchain/errors';
import AppAccountAvatarsPreview from 'shared/components/AppAccount/AppAccountAvatarsPreview';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { BaseModalHandler } from 'shared/components/BaseModal/BaseModalHandler';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import ARGUMENT_QUERY from 'shared/graphql/queries/argument.query';
import CLAIM_QUERY from 'shared/graphql/queries/claim.query';
import { AppAccountHoverQueryData } from 'shared/graphql/types/AppAccountHoverQuery';
import { agree_purple, agree_white } from 'shared/images/ArgumentActions/ArgumentActionsImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isLargerThanTablet, isWeb } from 'shared/styles/utils';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import { SlashArgumentReason, SlashType } from 'shared/types/slashing';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import AgreeConfirmationModal from 'web/src/components/Modals/AgreeConfirmationModal';
import FlagConfirmationModal from 'web/src/components/Modals/FlagConfirmationModal';
import OutOfTruModal from 'web/src/components/Modals/OutOfTruModal';
import StakingLimitModal from 'web/src/components/Modals/StakingLimitModal';
import { truToast, truToastError, truToastSuccess } from '../Toast/TruToast';

interface Props {
  account?: Account;
  argument: Argument;
  client?: ApolloClient<any>;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ArgumentActions = (props: WithApolloClient<Props>) => {
  const { account, argument, style, client } = props;
  const { upvotedCount, stakers, appAccountStake, appAccountSlash, isUnhelpful, downvotedCount } = argument;

  const onAgree = async (argument: Argument) => {
    LoadingBlanketHandler.show();
    try {
      const resp = await Chain.submitUpvote({
        argumentId: argument.id,
      });

      Analytics.track(AnalyticsEventsWeb.AgreeSentSuccessfully,
        { argumentId: argument.id, claimId: argument.claimId, community: argument.communityId });

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
      const a = await client.query<AppAccountHoverQueryData>({
        query: ARGUMENT_QUERY,
        variables: { argumentId: argument.id },
        fetchPolicy: 'network-only',
      });

      if (a.data && a.data.appAccount && a.data.appAccount.totalAgrees === 1) {
        Analytics.track(AnalyticsEventsWeb.FirstAgree, { argumentId: argument.id });
      }

      if (account !== undefined) {
        client.query({
          query: APP_ACCOUNT_BALANCE_QUERY,
          variables: { id: account.address },
          fetchPolicy: 'network-only',
        });
      }

    } catch (err) {
      if (err.code === CodeType.CodeMinBalance) {
        BaseModalHandler.basic(<OutOfTruModal onClose={ () => BaseModalHandler.close() } />);
      } else if (err.code === CodeType.CodeMaxAmountStakingReached) {
        BaseModalHandler.basic(<StakingLimitModal onClose={ () => BaseModalHandler.close() } />);
      } else {
        truToast(`Your agree could not be submitted: ${err.message}`);
      }
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const onAgreeAction = () => {
    Analytics.track(AnalyticsEventsWeb.AgreeButtonClicked);
    if (appAccountStake) {
      truToast('You have already Agreed with this Argument');
      return;
    }

    if (isUnhelpful) {
      truToast('This Argument has been downvoted, so no further action can be performed on it. Sorry!');
      return;
    }

    const onSubmit = () => {
      BaseModalHandler.close();
      onAgree(argument);
    };
    const onClose = () => BaseModalHandler.close();
    BaseModalHandler.basic(<AgreeConfirmationModal onSubmit={ onSubmit } onClose={ onClose } />);
  };

  const onNotHelpfulAction = () => {
    if (appAccountSlash) {
      truToastError('You have already downvoted this Argument');
      return;
    }

    if (isUnhelpful) {
      truToastError('This Argument has been downvoted, so no further action can be performed on it. Sorry!');
      return;
    }

    const onNotHelpful = async (argument: Argument, reason: SlashArgumentReason, reasonText: string) => {
      BaseModalHandler.close();

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

    const onClose = () => BaseModalHandler.close();
    BaseModalHandler.basic(<FlagConfirmationModal onSubmit={ onNotHelpful } onClose={ onClose } argument={ argument } />);
  };

  const agreeIconView = (
    <BaseIconImageView
      size={ IconSize.XSMALL }
      style={ { marginRight: Whitespace.TINY } }
      source={ agree_purple }
    />
  );

  const agreeIconViewHover = (
    <BaseIconImageView
      size={ IconSize.XSMALL }
      style={ { marginRight: Whitespace.TINY } }
      source={ agree_white }
    />
  );

  const agreeHoverColors = { regularText: Color.AGREE, regularBackground: Color.AGREE, hoverText: Color.WHITE, hoverBackground: Color.AGREE };
  const alreadyAgreedHoverColors = { regularText: Color.WHITE, regularBackground: Color.AGREE, hoverText: Color.WHITE, hoverBackground: Color.AGREE };

  const upvoters = (
    <React.Fragment>
      <AppAccountAvatarsPreview
        creators={ stakers }
        avatarCount={ 3 }
        size={ AvatarSize.SMALL }
        style={ { marginLeft: Whitespace.SMALL } }
      />
    </React.Fragment>
  );

  const agreeButtonTitle = upvotedCount > 0 ? `${upvotedCount} Agree${upvotedCount > 1 ? 's' : ''}` : 'Agree';

  return(
    <View style={ [ styles.container, style ] }>
      <BaseButton
        icon={ appAccountStake ? agreeIconViewHover : agreeIconView }
        title={ agreeButtonTitle }
        disabled={ appAccountSlash !== null }
        outline={ appAccountStake === null }
        onAction={ onAgreeAction }
        hoverIcon={ appAccountStake ? null : agreeIconViewHover }
        hoverColors={ appAccountStake ? alreadyAgreedHoverColors : agreeHoverColors }
        width={ 140 }

      />
      { isWeb() && isLargerThanTablet() ? upvoters : null }
      <View style={ { flex: 1 } } />
      <BaseActionable
        disabled={ appAccountStake !== null }
        onAction={ onNotHelpfulAction }
        style={ { opacity: appAccountStake ? 0.3 : 1, flexDirection: 'row', display: 'flex', alignItems: 'center', marginRight: Whitespace.LARGE } }
      >
        <BaseIconView
          name={ 'chevron-down' }
          color={ appAccountSlash ? Color.APP_PURPLE : Color.GRAY }
          size={ IconSize.XSMALL }
        />
        <BaseText
          style={ { marginLeft: 3 } }
          textSize={ TextSize.H5 }
          color={ appAccountSlash ? Color.APP_PURPLE : Color.GRAY }
        >
          { `${ downvotedCount > 0 ? downvotedCount + ' Downvotes' : 'Downvote' }` }
        </BaseText>
      </BaseActionable>
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
