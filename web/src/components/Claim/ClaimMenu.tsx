import Tippy from '@tippy.js/react';
import copy from 'copy-to-clipboard';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { connect } from 'react-redux';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { BaseModalHandler } from 'shared/components/BaseModal/BaseModalHandler';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import CLAIM_QUERY from 'shared/graphql/queries/claim.query';
import { edit_image_black, edit_image_purple } from 'shared/images/Edit/EditImages';
import { best_black, best_purple } from 'shared/images/Filters/FilterImages';
import { flag_black, flag_purple } from 'shared/images/Flag/FlagImages';
import { share_black, share_purple } from 'shared/images/Share/ShareImages';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { BaseClaim, Claim } from 'shared/types/claim';
import { Settings } from 'shared/types/settings';
import tippy from 'tippy.js';
import EditClaimModal from 'web/src/components/Modals/EditClaimModal';
import FeatureClaimModal from 'web/src/components/Modals/FeatureClaimModal';
import { ViewWidths } from 'web/src/styles';
import 'web/src/styles/tippy.css';
import { Routes } from '../../navigation/Routes';
import MenuItem from '../DropdownMenu/MenuItem';
import { truToast, truToastError, truToastSuccess } from '../Toast/TruToast';

interface Props {
  claim: Claim | BaseClaim;
  settings: Settings;
  style?: React.CSSProperties;
  account?: Account;
}

const ClaimMenu = (props: WithApolloClient<Props>) => {

  const { claim, style, client, account, settings } = props;
  const onFlagClaimAction = async () => {
    tippy.hideAll({ duration: 0 });
    try {
      await Chain.flagStory({ claimId: claim.id });
      truToastSuccess('Thanks for looking out and keeping our feed clean 👍');
    } catch (err) {
      truToastError(`We could not flag this claim: ${err}`);
    }
  };
  const onCopyLink = () => {
    tippy.hideAll({ duration: 0 });
    copy(`${AppConfig.base_url}${Routes.CLAIM}${claim.id}`);
    truToast('Link Copied to Clipboard');
  };

  const editClaim = async (claimId: ID, body: string) => {
    LoadingBlanketHandler.show();
    try {
      const resp = await Chain.editClaim({
        id: claimId,
        body: body,
      });
      console.log('PUBLISH RESPONSE: ', resp);

      client.query({
        query: CLAIM_QUERY,
        variables: { claimId: claimId },
        fetchPolicy: 'network-only',
      });

      truToastSuccess('Claim edited!');
      BaseModalHandler.close();

    } catch (err) {
      console.log(err);
      truToastError(`Your claim edit failed to submit: ${err}`);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const featureClaim = async (claimId: ID, communityId: string) => {
    LoadingBlanketHandler.show();
    try {
      fetch(
        `${AppConfig.chain_url }${AppConfig.api.endpoint}/claim_of_the_day`,
        {
          method: 'POST',
          mode: 'no-cors',
          credentials: 'include',
          headers: { 'Content-Type' : 'application/json' },
          body: JSON.stringify({
            community_id: communityId,
            claim_id: claimId,
          }),
        },
      )
      .then(() => {
        truToastSuccess('Claim featured successfully!');
      })
      .catch(error => truToastError('Error: ' + error));

      BaseModalHandler.close();
    } catch (err) {
      console.log(err);
      truToastError(`Your claim failed to be featured: ${err}`);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const onEditClaimAction = () => {
    tippy.hideAll({ duration: 0 });
    const onClose = () => BaseModalHandler.close();
    BaseModalHandler.basic(
      <EditClaimModal
        onClose={ onClose }
        claimId={ claim.id }
        incomingClaimBody={ claim.body }
        onSubmit={ editClaim }
      />, { width: '100%', maxWidth: 720 });
  };

  const onFeatureClaimAction = () => {
    tippy.hideAll({ duration: 0 });
    const onClose = () => BaseModalHandler.close();
    BaseModalHandler.basic(
      <FeatureClaimModal
        onClose={ onClose }
        claimId={ claim.id }
        onSubmit={ featureClaim }
      />, { width: '100%', maxWidth: 480 });
  };

  const renderEditClaim = () => {
    if (account && settings.claimAdmins.includes(account.id)) {
      return (
        <MenuItem
          onClick={ onEditClaimAction }
          icon={ { active: edit_image_purple, regular: edit_image_black } }
          style={ { borderRadius: 10 } }
        >
          Edit
        </MenuItem>
      );
    }
    return null;
  };

  const renderFeatureClaim = () => {
    if (account && settings.claimAdmins.includes(account.id)) {
      return (
        <MenuItem
          onClick={ onFeatureClaimAction }
          icon={ { active: best_purple, regular: best_black } }
          style={ { borderRadius: 10 } }
        >
          Feature
        </MenuItem>
      );
    }
    return null;
  };

  const content = (
    <div style={ styles.menu }>
      { renderEditClaim() }
      { renderFeatureClaim() }
      <MenuItem
        onClick={ onCopyLink }
        icon={ { active: share_purple, regular: share_black } }
        style={ { borderRadius: 10 } }
      >
        Share Claim Link
      </MenuItem>
      <MenuItem
        onClick={ onFlagClaimAction }
        icon={ { active: flag_purple, regular: flag_black } }
        style={ { borderRadius: 10 } }
      >
        Flag Claim
      </MenuItem>
    </div>
  );

  const onShow = () => tippy.hideAll({ duration: 0 });

  return (
    <div style={ { ...styles.container, ...style } }>
      <Tippy
        interactive={ true }
        interactiveBorder={ 10 }
        content={ content }
        delay={ [100, 0] }
        theme={ 'light' }
        placement={ 'bottom-end' }
        popperOptions={ { modifiers: { preventOverflow: { enabled: false }, hide: { enabled: false } } } }
        onShow={ onShow }
        animation={ 'shift-away' }
        trigger={ 'click' }
      >
        <div className={ 'menu-icon-overlay' } style={ { cursor: 'pointer', marginTop: 3 } }>
          <BaseIconView family={ 'Feather' } name={ 'more-horizontal' } color={ Color.APP_BLACK } />
        </div>
      </Tippy>
    </div>
  );
};

const styles = {
  container: { display: 'flex', alignItems: 'center' },
  menu: {
    borderRadius: Whitespace.LARGE,
    width: ViewWidths.CLAIM_MENU,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(withApollo(ClaimMenu));
