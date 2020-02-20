import React, { CSSProperties, useState } from 'react';
import { StyleSheet } from 'react-native';
import { BaseButtonProps } from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

const BaseButton = (props: BaseButtonProps) => {
  const {
    icon,
    title,
    disabled,
    width,
    color,
    accentColor,
    outline,
    disabledIcon,
    height,
    onAction,
    style,
    textSize,
    borderRadius,
    textAlign,
    bold,
    hoverColors,
    hoverIcon,
    className,
    textStyle,
    iconAlign,
    hoverTitle,
  } = props;

  const [ hover, setHover ] = useState(false);

  const onMouseOver = () => setHover(true);
  const onMouseOut = () => setHover(false);

  let internalStyle: CSSProperties = { width, height, borderRadius };
  let titleColor: Color = color;
  let buttonTitle = hover && hoverTitle ?  hoverTitle : title;

  if (outline) {
    if (hoverColors) {
      if (disabled) {
        internalStyle.border = `1px solid ${Color.DISABLED_BUTTON}`;
        titleColor = Color.DISABLED_BUTTON;
      } else {
        if (hover) {
          internalStyle.border = `1px solid ${hoverColors.hoverBackground}`;
          internalStyle.backgroundColor = hoverColors.hoverBackground;
          titleColor = hoverColors.hoverText;
        } else {
          internalStyle.border = `1px solid ${hoverColors.regularBackground}`;
          titleColor = hoverColors.regularText;
        }
      }
    } else {
      if (disabled ) {
        internalStyle.border = `1px solid ${ disabled ? Color.DISABLED_BUTTON : accentColor }`;
        titleColor = disabled ? Color.DISABLED_BUTTON : color;
      } else {
        if (hover) {
          internalStyle.backgroundColor = accentColor;
          titleColor = Color.WHITE;
        } else {
          internalStyle.border = `1px solid ${ disabled ? Color.DISABLED_BUTTON : accentColor }`;
          titleColor = disabled ? Color.DISABLED_BUTTON : color;
        }
      }
    }
  } else {
    if ( hoverColors) {
      if (disabled) {
        internalStyle.backgroundColor = Color.DISABLED_BUTTON;
        titleColor = Color.WHITE;
      } else {
        if (hover) {
          internalStyle.backgroundColor = hoverColors.hoverBackground;
          titleColor = hoverColors.hoverText;
        } else {
          internalStyle.backgroundColor = hoverColors.regularBackground;
          titleColor = hoverColors.regularText;
        }
      }
    } else {
      internalStyle.backgroundColor = disabled ? Color.DISABLED_BUTTON : accentColor;
      titleColor = disabled ? Color.WHITE : color;
    }
  }

  if (textAlign) {
    if (textAlign === 'left') { internalStyle.justifyContent = 'flex-start'; }
    else if (textAlign === 'right') { internalStyle.justifyContent = 'flex-end'; }
    else { internalStyle.justifyContent = 'center'; }
  }

  const renderIconAndText = () => {
    if (iconAlign === 'left') {
      return (
        <React.Fragment>
          { disabled ? (disabledIcon ? disabledIcon : null) : (icon ? ( hover && hoverIcon ? hoverIcon : icon ) : null) }
          <BaseText color={ titleColor } textSize={ textSize } bold={ bold } style={ textStyle }>{ buttonTitle }</BaseText>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <BaseText color={ titleColor } textSize={ textSize } bold={ bold } style={ textStyle }>{ buttonTitle }</BaseText>
        { disabled ? (disabledIcon ? disabledIcon : null) : (icon ? ( hover && hoverIcon ? hoverIcon : icon ) : null) }
      </React.Fragment>
    );
  };

  return (
    <button
      className={ `base-button ${ outline ? 'outline' : 'filled' } ${className ? className : ''}` }
      onMouseOut={ onMouseOut }
      onMouseOver={ onMouseOver }
      disabled={ disabled }
      onClick={ onAction }
      style={ { ...styles.container, ...internalStyle, ...StyleSheet.flatten(style) } }
    >
      { renderIconAndText() }
    </button>
  );
};

BaseButton.defaultProps = {
  width: 150,
  height: 36,
  outline: true,
  color: Color.APP_BLACK,
  accentColor: Color.APP_BLACK,
  borderRadius: Whitespace.LARGE,
  textSize: TextSize.H5,
  textAlign: TextAlign.CENTER,
  bold: false,
  iconAlign: 'left',
};

const styles = {
  container: {
    paddingHorizontal: Whitespace.LARGE,
    borderRadius: Whitespace.TINY,
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
};

export default BaseButton;
