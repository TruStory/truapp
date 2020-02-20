import * as React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { Whitespace } from 'shared/styles/views';

interface Props extends NavigationScreenProps {
  position?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
}

const CloseButton = (props: Props) => {
  const { navigation, position, style } = props;

  const marginPadding = position === 'right' ? { marginRight: Whitespace.CONTAINER } : { marginLeft: Whitespace.CONTAINER };

  return (
    <TouchableOpacity
      onPress={ () => navigation.dismiss() }
      hitSlop={ { top: 30, bottom: 30, left: 30, right: 30 } }
      style={ [ marginPadding, style ] }
    >
      <BaseIconView name={ 'x' } />
    </TouchableOpacity>
  );
};

export default withNavigation(CloseButton);
