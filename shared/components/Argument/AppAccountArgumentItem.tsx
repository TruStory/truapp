import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ArgumentHeader from 'shared/components/Argument/ArgumentHeader';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';

interface Props {
  argument: Argument;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const AppAccountArgumentItem = (props: Props) => {
  const { argument, style } = props;
  const { summary } = argument;

  return(
    <View style={ [ styles.container, style ] }>
      <View style={ { flexDirection: 'column' } }>
        <ArgumentHeader  argument={ argument } />
        <ArgumentSummaryText summary={ summary } style={ { marginTop: Whitespace.TINY } } />
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', borderRadius: Whitespace.TINY },
});

export default AppAccountArgumentItem;
