import React, { ChangeEvent, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { TruTipText } from 'shared/components/WebOnly/TruTip';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily, WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import TruTip from 'web/src/components/Popovers/TruTip';

interface Props {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  color: Color;
  placeholder: string;
  value: string;
  onMouseOver?: () => void;
  onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onMouseOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled: boolean;
  style?: React.CSSProperties;
  tip?: TruTipText;
  maxRows: number;
  textSize: TextSize;
}

const BaseTextArea = (props: Props) => {
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
    maxRows,
  } = props;

  const textSize: any = props.textSize ? props.textSize : TextSize.H4;

  const inputJsx = (
    <TextareaAutosize
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
      maxRows={ maxRows }
    />
  );

  if (tip) { return ( <TruTip tip={ tip }>{ inputJsx }</TruTip> ); }
  return inputJsx;
};

const styles = {
  container: {
    border: 'none',
    fontFamily: FontFamily.base,
    fontSize: WebFontSize.H4,
    width: '100%',
    outline: 'none',
    height: 50,
    resize: 'none' as 'none',
    overflow: 'hidden',
    boxSizing: 'border-box' as 'border-box',
  },
};

BaseTextArea.defaultProps = {
  color: Color.APP_BLACK,
  disabled: false,
  maxRows: 5,
  textSize: TextSize.H4,
};

export default BaseTextArea;
