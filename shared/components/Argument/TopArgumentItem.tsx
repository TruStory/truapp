import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ArgumentActions from 'shared/components/Argument/ArgumentActions';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import TopArgumentHeader from 'shared/components/Argument/TopArgumentHeader';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { FeedClaim } from 'shared/types/claim';

interface Props {
  claim: FeedClaim;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const TopArgumentItem = (props: Props) => {
  const { claim, style } = props;
  const { topArgument } = claim;

  if (topArgument === null) {
    return null;
  }

  const { vote } = topArgument;
  const backgroundColor =  vote ? Color.BACK_BACKGROUND : Color.CHALLENGE_BACKGROUND;

  return(
    <View style={ [ styles.container, style, { backgroundColor } ] }>
      <View style={ styles.argumentContainer }>
        <TopArgumentHeader argument={ topArgument } />
        <ArgumentSummaryText summary={ topArgument.summary } style={ { marginTop: Whitespace.TINY } } />
        <ArgumentActions
          argument={ topArgument }
          style={ { marginTop: Whitespace.SMALL } }
        />
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', borderRadius: Whitespace.TINY, flex: 1 },
  argumentContainer: { flexDirection: 'column', padding: Whitespace.CONTAINER + 4 },
});

export default TopArgumentItem;
