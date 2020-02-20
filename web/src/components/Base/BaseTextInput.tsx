import React, { ChangeEvent, KeyboardEvent } from 'react';
import { TruTipText } from 'shared/components/WebOnly/TruTip';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily, WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import TruTip from 'web/src/components/Popovers/TruTip';

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  color: Color;
  placeholder: string;
  value: string;
  onMouseOver?: () => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onMouseOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled: boolean;
  style?: React.CSSProperties;
  tip?: TruTipText;
  type?: 'text' | 'password';
  textSize: TextSize;
}

const BaseTextInput = (props: Props) => {
  const {
    onChange,
    placeholder,
    value,
    style,
    disabled,
    onFocus,
    onMouseOut,
    onMouseOver,
    onBlur,
    tip,
    color,
    onKeyUp,
    onKeyDown,
    type,
  } = props;

  const textSize: any = props.textSize ? props.textSize : TextSize.H4;

  const inputJsx = (
    <input
      type={ type }
      onKeyDown={ onKeyDown }
      onKeyUp={ onKeyUp }
      placeholder={ placeholder }
      style={ { ...styles.container, ...{ color, fontSize: WebFontSize[textSize], lineHeight: `${WebLineHeight[textSize]}px` }, ...style } }
      value={ value }
      onChange={ onChange }
      onMouseOut={ onMouseOut }
      onMouseOver={ onMouseOver }
      onFocus={ onFocus }
      onBlur={ onBlur }
      disabled={ disabled }
    />
  );

  if (tip) { return ( <TruTip tip={ tip }>{ inputJsx }</TruTip> ); }
  return inputJsx;
};

const styles = {
  container: {
    border: 'none',
    fontFamily: FontFamily.base,
    width: '100%',
    outline: 'none',
    height: 30,
    boxSizing: 'border-box' as 'border-box',
  },
};

BaseTextInput.defaultProps = {
  color: Color.APP_BLACK,
  disabled: false,
  type: 'text',
  textSize: TextSize.H4,
};

export default BaseTextInput;
