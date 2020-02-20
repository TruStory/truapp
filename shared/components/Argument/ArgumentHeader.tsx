import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AppAccountInfo from 'shared/components/AppAccount/AppAccountInfo';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import DateUtil from 'shared/utils/date';

interface Props {
  argument: Argument;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ArgumentHeader = (props: Props) => {
  const { argument, style } = props;
  const { creator, vote } = argument;

  const color = vote ? Color.BACK : Color.CHALLENGE;
  const voteText = vote ? 'Backed' : 'Challenged';

  return (
    <View style={ [styles.container, style] }>
      <AppAccountInfo
        appAccount={ creator }
        avatarStyle={ { borderWidth: 1, borderColor: color, borderStyle: 'solid', padding: 3, marginRight: Whitespace.CONTAINER, borderRadius: Whitespace.LARGE + Whitespace.TINY } }
      />
      <BaseIconView
        family={ 'Material' }
        color={ color }
        size={ 5 }
        name={ 'fiber-manual-record' }
        style={ { marginLeft: Whitespace.TINY, marginRight: Whitespace.TINY } }
      />
      <BaseText color={ color } textSize={ TextSize.H5 }>{ voteText }</BaseText>
      <BaseIconView
        family={ 'Material' }
        color={ color }
        size={ 5 }
        name={ 'fiber-manual-record' }
        style={ { marginLeft: Whitespace.TINY, marginRight: Whitespace.TINY } }
      />
      <BaseText
        textSize={ TextSize.H5 }
        color={ color }
        style={ { marginRight: 3 } }
      >
        { DateUtil.format(argument.createdTime) }
      </BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', flex: 1 },
});

export default ArgumentHeader;
