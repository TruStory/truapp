import React from 'react';
import { Animated, FlatList, FlatListProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ReactCollapsibleProps } from 'shared/styles/props';

interface Props extends FlatListProps<any> {
  collapsible: ReactCollapsibleProps;
  style?: StyleProp<ViewStyle>;
}

const AnimatedFlatListJsx = Animated.createAnimatedComponent(FlatList);

class AnimatedFlatList extends React.Component<Props> {
  listRef: React.RefObject<any>;

  scrollToIndex(index: number, animated: boolean) {
    this.listRef.current.getNode().scrollToIndex({ index, animated });
  }

  scrollToOffset(offset: number, animated: boolean) {
    this.listRef.current.getNode().scrollToOffset({ offset, animated });
  }

  scrollToEnd( animated: boolean) {
    this.listRef.current.getNode().scrollToEnd({ animated });
  }

  constructor(props: Props) {
    super(props);
    this.listRef = React.createRef();
  }

  render() {

    const { collapsible, style } = this.props;
    const { paddingHeight, animatedY, onScroll } = collapsible;

    return (
      <AnimatedFlatListJsx
        { ...this.props }
        ref={ this.listRef }
        scrollIndicatorInsets={ { top: paddingHeight } }
        contentContainerStyle={ [ styles.container, { paddingTop: 50 }, style ] }
        _mustAddThis={ animatedY }
        onScroll={ onScroll }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {  },
});

export default AnimatedFlatList;
