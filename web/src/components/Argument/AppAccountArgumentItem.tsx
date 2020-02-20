import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ArgumentHeader from 'shared/components/Argument/ArgumentHeader';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { Whitespace } from 'shared/styles/views';
import { Argument } from 'shared/types/argument';
import { Routes } from '../../navigation/Routes';

interface Props {
  argument: Argument;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const AppAccountArgumentItem = (props: Props) => {
  const { argument, style } = props;
  const { summary } = argument;

  return(

    <View style={ [ styles.container, style ] }>
      <View style={ { paddingLeft: Whitespace.CONTAINER, paddingRight: Whitespace.CONTAINER, flexDirection: 'column' } }>
        <ArgumentHeader argument={ argument } />
        <BaseATag
          appLink={ `${Routes.CLAIM}${argument.claimId}${Routes.ARGUMENT}${argument.id}` }
          style={ { marginTop: Whitespace.TINY } }
        >
          <ArgumentSummaryText summary={ summary } />
        </BaseATag>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', borderRadius: Whitespace.TINY },
});

export default AppAccountArgumentItem;
