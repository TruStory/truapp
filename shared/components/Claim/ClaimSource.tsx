import React from 'react';
import { Linking, StyleProp, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppAccountLink from 'shared/components/AppAccount/AppAccountLink';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { BaseClaim } from 'shared/types/claim';
import DateUtil from 'shared/utils/date';
import ValidationUtil from 'shared/utils/validation';
import URL from 'url-parse';

export interface ClaimSourceProps {
  style?: StyleProp<any> & React.CSSProperties;
  claim: BaseClaim;
}

const ClaimSource = (props: ClaimSourceProps) => {

  const { claim, style } = props;
  const { community, creator, createdTime, source } = claim;
  const { name } = community;

  const processSource = () => {
    if (!source || source.trim() === '' || !ValidationUtil.validateUrl(source))
      return null;

    const url = new URL(source);

    const openSource = () => {
      Linking.canOpenURL(source).then(supported => {
        if (supported) {
          Linking.openURL(source);
        }
      });
    };
    return (
      <TouchableOpacity onPress={ openSource }>
        <BaseText>
          <BaseText textSize={ TextSize.H6 } color={ Color.GRAY }>/ </BaseText>
          <BaseText textSize={ TextSize.H6 } color={ Color.GRAY }>{ url.hostname }</BaseText>
        </BaseText>
      </TouchableOpacity>
    );

  };

  return (
    <View style={ [ styles.container, style ] }>
      <BaseText textSize={ TextSize.H6 } color={ Color.GRAY } style={ { paddingRight: Whitespace.TINY } }>
        { `${name} /` }
      </BaseText>
      <AppAccountLink appAccount={ creator } color={ Color.GRAY } textSize={ TextSize.H6 } />
      <BaseText textSize={ TextSize.H6 } color={ Color.GRAY } style={ { paddingLeft: Whitespace.TINY, paddingRight: Whitespace.TINY } }>
        { `on ${DateUtil.format(createdTime)}` }
      </BaseText>
      { source ? processSource() : null }
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap' },
});

export default ClaimSource;
