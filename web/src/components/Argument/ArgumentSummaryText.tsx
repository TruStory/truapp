import React from 'react';
import { View } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily } from 'shared/styles/fonts';
import { Whitespace } from 'shared/styles/views';

interface Props {
  argumentId: number;
  summary: string;
  style?: React.CSSProperties;
}

const ArgumentSummaryText = (props: Props) => {
  const { argumentId, summary, style } = props;

  return(
    <div style={ { ...styles.container, ...style } } className={ `shareable-argument-${argumentId}` }>
      <View style={ styles.tldr }>
        <BaseText bold={ true } textSize={ TextSize.H6 }>TLDR</BaseText>
      </View>
      <BaseText
        textSize={ TextSize.H3 }
        fontFamily={ FontFamily.tldr }
      >
        { summary }
      </BaseText>
    </div>
  );

};

const styles = {
  container: { display: 'flex' },
  tldr: {
    width: 45,
    marginRight: Whitespace.SMALL,
    paddingRight: Whitespace.TINY,
    marginTop: Whitespace.TINY,
    borderRight: `1px solid ${Color.APP_PURPLE}`,
    boxSizing: 'border-box' as 'border-box',
  },
};

export default ArgumentSummaryText;
