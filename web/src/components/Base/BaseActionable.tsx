import * as React from 'react';
import { StyleSheet } from 'react-native';
import { BaseActionableProps } from 'shared/components/Base/BaseActionable';
import { Color } from 'shared/styles/colors';
import TruTip from 'web/src/components/Popovers/TruTip';

const BaseActionable = (props: BaseActionableProps) => {
  const {
    onAction,
    style,
    disabled,
    children,
    tip,
    onMouseOut,
    onMouseOver,
    className,
  } = props;

  const incomingStyle = StyleSheet.flatten(style);

  const buttonJsx = (
    <button
      disabled={ disabled }
      onMouseOut={ onMouseOut }
      onMouseOver={ onMouseOver }
      onClick={ onAction }
      style={ { ...styles.container, ...incomingStyle } }
      className={ className ? className : '' }
    >
      { children }
    </button>
  );

  if (tip) { return ( <TruTip tip={ tip }>{ buttonJsx }</TruTip> ); }
  return buttonJsx;
};

const styles = {
  container: {
    width: 'auto',
    background: Color.TRANSPARENT,
    border: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'inherit' as 'inherit',
    alignItems: 'center',
    cursor: 'pointer',
  },
};

export default BaseActionable;
