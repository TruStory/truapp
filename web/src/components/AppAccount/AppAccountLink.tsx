import Tippy, { tippy } from '@tippy.js/react';
import * as React from 'react';
import { AppAccountLinkProps } from 'shared/components/AppAccount/AppAccountLink';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Routes } from '../../navigation/Routes';
import BaseATag from '../Base/BaseATag';
import AppAccountHover from './AppAccountHover';

interface Props extends AppAccountLinkProps { }

const AppAccountLink = (props: Props) => {
  const { appAccount, color, textSize, bold, style, children } = props;

  const [loaded, setLoaded] = React.useState(false);

  const renderChildren = () => {
    if (children) {
      return (
        <BaseATag
          color={ color }
          textSize={ textSize }
          bold={ bold }
          appLink={ `${Routes.PROFILE}${appAccount.id}` }
          style={ style }
        >
          { children }
        </BaseATag>
      );

    } else {
      return (
        <BaseATag
          color={ color }
          textSize={ textSize }
          bold={ bold }
          appLink={ `${Routes.PROFILE}${appAccount.id}` }
          style={ style }
        >
          { appAccount.userProfile.username }
        </BaseATag>
      );
    }
  };

  const onShow = () => tippy.hideAll({ duration: 0 });

  if (window.innerWidth > 769) {
    return (
      <Tippy
        content={ loaded ? <AppAccountHover appAccountId={ appAccount.id } /> : <div style={ { width: 275 } } /> }
        interactive={ true }
        delay={ loaded ? [300, 0] : [0, 0] }
        theme={ 'light' }
        interactiveBorder={ 10 }
        placement={ 'auto' }
        popperOptions={ { modifiers: { preventOverflow: { enabled : false }, hide: { enabled : false }  } } }
        onShow={ onShow }
        inertia={ true }
        lazy={ true }
        onShown={ () => setLoaded(true) }
      >
        <span style={ { cursor: 'pointer' } }>
          { renderChildren() }
        </span>
      </Tippy>
    );
  }

  return renderChildren();
};

AppAccountLink.defaultProps = {
  color: Color.APP_BLACK,
  textSize: TextSize.H5,
  bold: true,
};

export default AppAccountLink;
