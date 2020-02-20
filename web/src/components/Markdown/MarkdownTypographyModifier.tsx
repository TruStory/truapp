import React from 'react';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { TruTipText } from 'shared/components/WebOnly/TruTip';
import { Color } from 'shared/styles/colors';
import BaseActionable from 'web/src/components/Base/BaseActionable';

interface Props {
  style?: React.CSSProperties;
  modifier: string;
  color: Color;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  icon: string;
  wrap?: boolean; // this indicates that the modifier is to be appended on both sides of the selected text
  onMarkdownModified: (markdownText: string) => void;
  tip: TruTipText;
}

const MarkdownTypographyModifier = (props: Props) => {
  const { onMarkdownModified, modifier, icon, wrap, inputRef, tip, style, color } = props;

  const onModifier = () => {

    if (inputRef.current) {
      const cursorStart = inputRef.current.selectionStart;
      const cursorEnd = inputRef.current.selectionEnd;
      const allText = inputRef.current.value;
      const selectedText = allText.substring(cursorStart, cursorEnd);
      let cursorPosition = inputRef.current.selectionEnd;

      if (selectedText !== '') {
        // removes markdown modifier from selected text
        if (allText.substring(cursorStart - modifier.length, cursorStart) === modifier) {
          const textBeforeSelection = allText.substring(0, cursorStart - modifier.length );
          const textAfterSelection = allText.substring(cursorEnd + modifier.length, allText.length);
          cursorPosition = textBeforeSelection.length + selectedText.length;

          onMarkdownModified(`${textBeforeSelection}${selectedText}${textAfterSelection}`);
        } else {
          const textBeforeSelection = allText.substring(0, cursorStart );
          const textAfterSelection = allText.substring(cursorEnd, allText.length);
          cursorPosition = textBeforeSelection.length + modifier.length + selectedText.length;

          if (wrap) {
            // adds both sided markdown modifier to selected text
            onMarkdownModified(`${textBeforeSelection}${modifier}${selectedText}${modifier}${textAfterSelection}`);
          } else {
            // adds one sided markdown modifier to selected text
            onMarkdownModified(`${textBeforeSelection}${modifier}${selectedText}${textAfterSelection}`);
          }
        }
      } else {
        if (wrap) {
          // removes both-sided markdown modifier
          if (allText.substring(cursorStart - modifier.length, cursorStart) === modifier
          && allText.substring(cursorEnd, cursorEnd + modifier.length) === modifier ) {
            const textBeforeCursor = allText.substring(0, cursorStart - modifier.length);
            const textAfterCursor = allText.substring(cursorEnd + modifier.length, allText.length);
            cursorPosition = textBeforeCursor.length;

            onMarkdownModified(`${textBeforeCursor}${textAfterCursor}`);
          } else {
          // adds both-sided markdown modifier
            const textBeforeCursor = allText.substring(0, cursorStart);
            const textAfterCursor = allText.substring(cursorEnd, allText.length);
            cursorPosition = textBeforeCursor.length + modifier.length;

            onMarkdownModified(`${textBeforeCursor}${modifier}${modifier}${textAfterCursor}`);
          }
        } else {
          const textAfterCursor = allText.substring(cursorEnd, allText.length);

          if (allText.substring(cursorStart - modifier.length, cursorStart) === modifier) {
            // removes one sided markdown modifier
            const textBeforeCursor = allText.substring(0, cursorStart - modifier.length);
            cursorPosition = textBeforeCursor.length;

            onMarkdownModified(`${textBeforeCursor}${textAfterCursor}`);
          } else {
            // adds one sided markdown modifier
            const textBeforeCursor = allText.substring(0, cursorStart);
            cursorPosition = textBeforeCursor.length + modifier.length;

            onMarkdownModified(`${textBeforeCursor}${modifier}${textAfterCursor}`);
          }
        }
      }

      inputRef.current.focus();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionEnd = cursorPosition;
        }
      }, 1);
    }
  };

  return (
    <BaseActionable onAction={ onModifier } tip={ tip } style={ { ...styles.container, ...style } }>
      <BaseIconView name={ icon } family={ 'Material' } color={ color } />
    </BaseActionable>
  );
};

MarkdownTypographyModifier.defaultProps = {
  wrap: true,
  color: Color.APP_BLACK,
};

const styles = {
  container: { },
};

export default MarkdownTypographyModifier;
