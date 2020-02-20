
import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import AppAccountClaimsCreatedTabPanel from 'shared/components/AppAccount/AppAccountClaimsCreatedTabPanel';
import AppAccountClaimsWithAgreesTabPanel from 'shared/components/AppAccount/AppAccountClaimsWithAgreesTabPanel';
import AppAccountClaimsWithArgumentsTabPanel from 'shared/components/AppAccount/AppAccountClaimsWithArgumentsTabPanel';
import { Color } from 'shared/styles/colors';
import { MobileFontSize } from 'shared/styles/fonts';
import { AppAccountProfileDetails } from 'shared/types/appAccount';
import { AppAccountArgumentsFilter } from 'shared/types/argument';

interface Props {
  appAccountDetails: AppAccountProfileDetails;
  style?: StyleProp<ViewStyle>;
}
const AppAccountTabsComponent = (props: Props) => {
  const { appAccountDetails, style } = props;

  return (
    <ScrollableTabView
      style={ [ styles.container, { flexGrow: 1 }, style ] }
      tabBarActiveTextColor={ Color.APP_PURPLE }
      tabBarTextStyle={ { fontSize: MobileFontSize.H5 } }
      tabBarInactiveTextColor={ Color.GRAY }
      tabBarUnderlineStyle={ { height: 1, backgroundColor: Color.APP_PURPLE } }
    >
      <AppAccountClaimsCreatedTabPanel
        appAccountId={ appAccountDetails.id }
        tabLabel={ `${appAccountDetails.totalClaims} Claims` }
      />
      <AppAccountClaimsWithArgumentsTabPanel
        appAccountId={ appAccountDetails.id }
        filter={ AppAccountArgumentsFilter.CREATED }
        tabLabel={ `${appAccountDetails.totalArguments} Arguments` }
      />
      <AppAccountClaimsWithAgreesTabPanel
        appAccountId={ appAccountDetails.id }
        filter={ AppAccountArgumentsFilter.AGREED }
        tabLabel={  `${appAccountDetails.totalAgrees} Agreed`  }
      />
    </ScrollableTabView>
  );

};

export default AppAccountTabsComponent;

const styles = StyleSheet.create({
  container: { },
});
