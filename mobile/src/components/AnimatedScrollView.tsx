import React from 'react';
import { Animated, ScrollViewProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ScrollView } from 'react-navigation';
import { ReactCollapsibleProps } from 'shared/styles/props';

interface Props extends ScrollViewProps {
  collapsible: ReactCollapsibleProps;
  children: React.ReactNode | React.ReactNode[];
  style?: StyleProp<ViewStyle>;
}

const AnimatedScrollView = (props: Props) => {

  const { collapsible, children, style } = props;
  const { paddingHeight, animatedY, onScroll } = collapsible;

  const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

  return (
    <AnimatedScrollView
      { ...props }
      scrollIndicatorInsets={ { top: paddingHeight } }
      contentContainerStyle={ [ styles.container, { paddingTop: paddingHeight }, style ] }
      _mustAddThis={ animatedY }
      onScroll={ onScroll }
      scrollEventThrottle={ 16 }
    >
      { children }
    </AnimatedScrollView>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

export default AnimatedScrollView;
