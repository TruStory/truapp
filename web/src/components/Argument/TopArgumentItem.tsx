import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ArgumentActions from 'shared/components/Argument/ArgumentActions';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import TopArgumentHeader from 'shared/components/Argument/TopArgumentHeader';
import { Color } from 'shared/styles/colors';
import { isWeb } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { FeedClaim } from 'shared/types/claim';
import { Routes } from '../../navigation/Routes';
import BaseATag from '../Base/BaseATag';

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

  const { vote, summary } = topArgument;
  const backgroundColor =  vote ? Color.BACK_BACKGROUND : Color.CHALLENGE_BACKGROUND;

  return(
    <View style={ [ styles.container, style, { backgroundColor } ] }>
      <View style={ styles.argumentContainer }>
        <TopArgumentHeader argument={ topArgument } />
        <View style={ styles.argumentDetailsContainer }>
          <BaseATag
            appLink={ `${Routes.CLAIM}${claim.id}${Routes.ARGUMENT}${topArgument.id}` }
          >
            <ArgumentSummaryText summary={ summary } />
          </BaseATag>
          <ArgumentActions
            argument={ topArgument }
            style={ styles.argumentActionsContainer }
          />
        </View>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', borderRadius: Whitespace.TINY },
  argumentContainer: { flexDirection: 'column', padding: Whitespace.CONTAINER + 4 },
  argumentDetailsContainer: { marginLeft: ( isWeb() ? Whitespace.LARGE + Whitespace.MEDIUM : 0 ) },
  argumentActionsContainer: { marginTop: ( isWeb() ? Whitespace.MEDIUM : Whitespace.LARGE * 2 ), marginBottom: ( !isWeb() ? Whitespace.SMALL : 0 ) },
});

export default TopArgumentItem;
