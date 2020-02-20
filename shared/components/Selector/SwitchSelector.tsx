import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import TrustorySelector from 'shared/components/Selector/TrustorySelector';
import { AccentColor, Color } from 'shared/styles/colors';
import { MobileFontSize, WebFontSize } from 'shared/styles/fonts';
import { isWeb } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';

interface Props {
  accentColor: AccentColor;
  leftText: string;
  rightText: string;
  selected?: string;
  onPress?: (value: string) => void;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const SwitchSelector = (props: Props) => {

  const { rightText, leftText, selected, onPress, accentColor, style } = props;

  const challengeAccent = accentColor === AccentColor.CHALLENGE;
  const sliderBackground = challengeAccent ?  Color.CHALLENGE_BACKGROUND : Color.BACK_BACKGROUND;
  const buttonColor = challengeAccent ? Color.CHALLENGE : Color.BACK;
  const textColor = Color.WHITE;

  const disabledTextColor = challengeAccent ? Color.CHALLENGE : Color.BACK;

  const options = [
    { label: leftText, value: leftText },
    { label: rightText, value: rightText },
  ];
  const initial = selected === rightText ? 1 : 0;

  return (
    <View style={ [ styles.container, style ] }>
      <TrustorySelector
        initial={ initial }
        style={ styles.container }
        options={ options }
        onPress={ onPress }
        textStyle={ { ...styles.text, color: disabledTextColor } }
        selectedTextStyle={ [ styles.text, { color: textColor } ] }
        backgroundColor={ sliderBackground }
        buttonColor={ buttonColor }
        hasPadding={ false }
        borderRadius={ Whitespace.TINY }
        height={ 34 }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  text: {
    fontSize: ( isWeb() ? WebFontSize.H5 : MobileFontSize.H5 ),
  },
});

export default SwitchSelector;
