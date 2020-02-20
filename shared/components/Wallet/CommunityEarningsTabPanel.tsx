import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import CommunityEarningsList from 'shared/components/Wallet/CommunityEarningsList';
import { Address } from 'shared/types/appAccount';

interface Props {
  tabLabel?: string;
  appAccountId: Address;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const CommunityEarningsTabPanel = (props: Props) => {
  const { style, appAccountId } = props;

  return (
    <View style={ [ styles.container, style ] }>
      <CommunityEarningsList appAccountId={ appAccountId } />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {  },
});

export default CommunityEarningsTabPanel;
