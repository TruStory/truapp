import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props {
  header: string;
  text: string;
  small: boolean;
  onRefresh?: () => void;
}

const ErrorComponent = (props: Props) => {
  const { text, small, header, onRefresh } = props;

  const displayText = (
    <View style={ styles.text }>
      <BaseText
        align={ TextAlign.CENTER }
        color={ Color.LIGHT_GRAY }
        bold={ true }
      >
        { header }
      </BaseText>
      <BaseText align={ TextAlign.CENTER } color={ Color.GRAY }> { text }</BaseText>
    </View>
  );

  if (small)
    return displayText;

  const onRetry = () => onRefresh && onRefresh();

  const refreshButton = (
    <View style={ styles.buttonContainer }>
      { onRefresh ? <BaseButton onAction={ onRetry } title={ 'Refresh' } color={ Color.GRAY } accentColor={ Color.GRAY } /> : null }
    </View>
  );

  return (
    <View style={ styles.container }>
      { /* <Image style={ styles.image } source={ nostories } /> */ }
      { displayText }
      { Platform.OS === 'web' ? refreshButton : null }
    </View>
  );
};

ErrorComponent.defaultProps = {
  small: false,
  header : 'Oops!',
  text: 'Something went wrong.',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Whitespace.LARGE,
    paddingBottom: Whitespace.LARGE,
  },
  text: {
    marginTop: Whitespace.MEDIUM,
    width: '100%',
  },
  image: {
    width: 110,
    height: 110,
  },
  buttonContainer: {
    marginTop: Whitespace.MEDIUM,
  },
});

export default ErrorComponent;
