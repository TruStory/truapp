import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ArgumentActions from 'shared/components/Argument/ArgumentActions';
import ArgumentDetails from 'shared/components/Argument/ArgumentDetails';
import ArgumentHeader from 'shared/components/Argument/ArgumentHeader';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import BaseActionable from 'shared/components/Base/BaseActionable';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Argument } from 'shared/types/argument';

interface Props {
  argument: Argument;
  onArgumentPress?: (argumentId: ID) => void;
  opened?: boolean;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ArgumentItem = (props: Props) => {
  const { argument, style, opened, onArgumentPress } = props;

  let argumentJsx = (
    <View style={ [ styles.container, style ] }>
      <View style={ styles.argumentContainer }>
        <View style={ styles.headerContainer }>
          <ArgumentHeader argument={ argument } />
        </View>
        <BaseActionable
          onAction={ () => onArgumentPress && onArgumentPress(argument.id) }
          style={ { marginTop: Whitespace.CONTAINER } }
        >
          <ArgumentSummaryText summary={ argument.summary } />
          <ArgumentDetails
            argument={ argument }
            style={ { marginTop: Whitespace.TINY } }
            opened={ opened }
          />
        </BaseActionable>
        <ArgumentActions
          argument={ argument }
          style={ { marginTop: Whitespace.MEDIUM } }
        />
      </View>
    </View>
  );

  if (argument.isUnhelpful) {
    return (
      <View style={ styles.slashedContainer }>
        { argumentJsx }
      </View>
    );
  }

  return argumentJsx;

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', borderRadius: Whitespace.TINY },
  headerContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  argumentContainer: { flexDirection: 'column' },
  slashedContainer: { opacity: 0.2 },
});

export default ArgumentItem;
