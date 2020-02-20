import { Selection } from 'mobile/src/components/Markdown/MarkdownInput';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { Color } from 'shared/styles/colors';

interface Props {
  style?: StyleProp<ViewStyle>;
  modifier: string;
  selection: Selection;
  color: Color;
  icon: string;
  wrap?: boolean; // this indicates that the modifier is to be appended on both sides of the selected text
  onMarkdownModified: (markdownText: string) => void;
}

const MarkdownTypographyModifier = (props: Props) => {

  const { style, modifier, icon, color, onMarkdownModified, wrap, selection } = props;

  const onModifier = () => {
    let text = '';
    if (selection.selectedText.trim() !== '') {
      if (selection.allText.substr(selection.start - modifier.length, modifier.length) === modifier) {
        let substr1 = selection.allText.substr(0, selection.start - modifier.length);
        let substr2 = selection.allText.substr(selection.end + (wrap ? modifier.length : 0), selection.allText.length);
        text = `${substr1}${selection.selectedText}${substr2}`;
      } else {
        let substr1 = selection.allText.substr(0, selection.start);
        let substr2 = selection.allText.substr(selection.end, selection.allText.length);
        text = ( wrap ? `${substr1}${modifier}${selection.selectedText}${modifier}${substr2}` :
          `${substr1}${modifier}${selection.selectedText}${substr2}` );
      }
    } else {
      let substr1 = selection.allText.substr(0, selection.start);
      let substr2 = selection.allText.substr(selection.end, selection.allText.length);
      text = ( wrap ? `${substr1}${modifier}${modifier}${substr2}` : `${substr1}${modifier}${substr2}` );
    }
    onMarkdownModified(text);
  };

  return (
    <BaseActionable onAction={ onModifier } style={ [ styles.container, style ] }>
      <BaseIconView name={ icon } family={ 'Material' } color={ color } />
    </BaseActionable>
  );
};

MarkdownTypographyModifier.defaultProps = {
  color: Color.APP_BLACK,
};

const styles = StyleSheet.create({
  container: { },
});

export default MarkdownTypographyModifier;
