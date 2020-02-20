import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AppAccountInfo from 'shared/components/AppAccount/AppAccountInfo';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';

interface Props {
  argument: Argument;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const TopArgumentHeader = (props: Props) => {
  const { argument, style } = props;

  const { creator, vote } = argument;
  const color = vote ? Color.BACK : Color.CHALLENGE;

  return(
    <View style={ [ styles.container, style ] }>
      <AppAccountInfo
        appAccount={ creator }
        textSize={ TextSize.H5 }
        bold={ false }
        avatarStyle={ { borderWidth: 1, borderColor: color, borderStyle: 'solid', padding: 3, marginRight: Whitespace.CONTAINER, borderRadius: Whitespace.LARGE + Whitespace.TINY } }
      />
      <BaseIconView
        family={ 'Material' }
        color={ Color.GRAY }
        size={ 5 }
        name={ 'fiber-manual-record' }
        style={ { marginLeft: Whitespace.TINY, marginRight: Whitespace.TINY } }
      />
      <BaseText color={ Color.GRAY } textSize={ TextSize.H5 }>Top Argument</BaseText>
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flex: 1, alignItems: 'center' },
});

export default TopArgumentHeader;
