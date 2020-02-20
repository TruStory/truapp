import Tippy from '@tippy.js/react';
import copy from 'copy-to-clipboard';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { ArgumentMenuProps } from 'shared/components/Argument/ArgumentMenu';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { BaseModalHandler } from 'shared/components/BaseModal/BaseModalHandler';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { truToast } from 'shared/components/Toast/TruToast';
import ARGUMENT_QUERY from 'shared/graphql/queries/argument.query';
import { edit_image_black, edit_image_purple } from 'shared/images/Edit/EditImages';
import { share_black, share_purple } from 'shared/images/Share/ShareImages';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { toastOptions } from 'shared/utils/toast';
import tippy from 'tippy.js';
import EditArgumentModal from 'web/src/components/Modals/EditArgumentModal';
import { ViewWidths } from 'web/src/styles';
import 'web/src/styles/tippy.css';
import { Routes } from '../../navigation/Routes';
import MenuItem from '../DropdownMenu/MenuItem';

interface Props extends ArgumentMenuProps { }

const ArgumentMenu = (props: WithApolloClient<Props>) => {

  const { argument, style, account, settings, client } = props;
  const onCopyLink = () => {
    tippy.hideAll({ duration: 0 });
    copy(`${AppConfig.base_url}${Routes.CLAIM}${argument.claimId}${Routes.ARGUMENT}${argument.id}`);
    truToast('Link Copied to Clipboard');
  };

  const editArgument = async (argumentId: ID, argumentText: string, summaryText: string) => {
    LoadingBlanketHandler.show();
    try {
      const resp = await Chain.editArgument({
        argumentId,
        summary: summaryText,
        body: argumentText,
      });
      console.log('PUBLISH RESPONSE: ', resp);

      client.query({
        query: ARGUMENT_QUERY,
        variables: { argumentId: argumentId },
        fetchPolicy: 'network-only',
      });

      toast.success('Argument edited!', toastOptions);
      BaseModalHandler.close();

    } catch (err) {
      console.log(err);
      toast.error(`Your argument edit failed to submit: ${err}`, toastOptions);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const onEditArgumentAction = () => {
    tippy.hideAll({ duration: 0 });
    const onClose = () => BaseModalHandler.close();
    BaseModalHandler.basic(
      <EditArgumentModal
        onClose={ onClose }
        argumentId={ argument.id }
        incomingArgumentSummary={ argument.summary }
        incomingArgumentText={ argument.body }
        incomingArgumentVote={ argument.vote }
        onSubmit={ editArgument }
      />, { width: '100%', maxWidth: 720 });
  };

  const renderEditArgument = () => {
    if (!account) return null;
    if (account && !argument.isUnhelpful &&
      ((argument.creator.id === account.id && argument.stakers.length === 0) || settings.stakingAdmins.includes(account.id) )) {
      return (
        <MenuItem
          onClick={ onEditArgumentAction  }
          icon={ { active: edit_image_purple, regular: edit_image_black } }
          style={ { borderRadius: 10 } }
        >
          Edit
        </MenuItem>
      );
    }
    return null;
  };

  const content = (
    <div style={ styles.menu }>
      { renderEditArgument() }
      <MenuItem
        onClick={ onCopyLink  }
        icon={ { active: share_purple, regular: share_black } }
        style={ { borderRadius: 10 } }
      >
        Share Argument
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
        popperOptions={ { modifiers: { preventOverflow: { enabled : false }, hide: { enabled : false }  } } }
        onShow={ onShow }
        animation={ 'shift-away' }
        trigger={ 'click' }
      >
        <div className={ 'menu-icon-overlay' } style={ { cursor: 'pointer', marginTop: 3 } }>
          <BaseIconView  family={ 'Feather' } name={ 'more-horizontal' } color={ Color.APP_BLACK } />
        </div>
      </Tippy>
    </div>
  );
};

const styles = {
  container: { display: 'flex', alignItems:  'center' },
  menu: {
    borderRadius: Whitespace.LARGE,
    width: ViewWidths.ARGUMENT_MENU,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(withApollo(ArgumentMenu));
