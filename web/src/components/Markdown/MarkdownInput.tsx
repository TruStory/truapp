import React from 'react';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import TrustoryMarkdown from 'web/src/components/Markdown/TrustoryMarkdown';
import UserMentionsInputComponent from 'web/src/components/Markdown/UserMentionsInputComponent';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  color?: Color;
  placeholder: string;
  showPreview: boolean;
  height?: number;
  autoFocus: boolean;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  style?: React.CSSProperties;
}

class MarkdownInput extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  onUpdate = (
    event: { target: { value: string } },
    newValue: string,
    newPlainTextValue: string,
    ) => {
    const { onChange } = this.props;
    onChange(newPlainTextValue);
  }

  insertText = (myField: HTMLTextAreaElement, myValue: string) => {
    const { onChange, value } = this.props;
    let text = value;
    // Microsoft Edge
    if (window.navigator.userAgent.indexOf('Edge') > -1) {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;

      text = myField.value.substring(0, startPos) + myValue
             + myField.value.substring(endPos, myField.value.length);

      var pos = startPos + myValue.length;
      myField.focus();
      myField.setSelectionRange(pos, pos);
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart === 0) {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      text = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
      text += myValue;
    }
    onChange(text);
  }

  render() {
    const { height, value, textAreaRef, onBlur, placeholder, onFocus, autoFocus, style, showPreview, color } = this.props;

    if (showPreview) {
      return (
        <div style={ { height: height ? height : '100%', overflowY: 'auto', marginTop: Whitespace.MEDIUM } }>
          <TrustoryMarkdown>{ value }</TrustoryMarkdown>
        </div>
      );
    }

    return (
      <div style={ { ...styles.container, ...style } }>
        <UserMentionsInputComponent
          trigger={ '@' }
          height={ height ? height : 200 }
          value={ value }
          inputRef={ textAreaRef }
          onBlur={ onBlur }
          onChange={ this.onUpdate }
          placeholder={ placeholder }
          onFocus={ onFocus }
          autoFocus={ autoFocus }
          color={ color }
        />
      </div>
    );
  }
}

const styles = {
  container: { },
};

export default MarkdownInput;
