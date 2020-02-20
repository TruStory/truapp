import * as React from 'react';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { Account } from 'shared/blockchain/account';
import AppAccountClaimsCreatedTabPanel from 'shared/components/AppAccount/AppAccountClaimsCreatedTabPanel';
import AppAccountClaimsWithAgreesTabPanel from 'shared/components/AppAccount/AppAccountClaimsWithAgreesTabPanel';
import AppAccountClaimsWithArgumentsTabPanel from 'shared/components/AppAccount/AppAccountClaimsWithArgumentsTabPanel';
import { AppAccountProfileDetails } from 'shared/types/appAccount';
import { AppAccountArgumentsFilter } from 'shared/types/argument';
import 'web/src/styles/tabs.css';

interface Props {
  account? : Account;
  appAccountDetails: AppAccountProfileDetails;
  style?: React.CSSProperties;
}

const AppAccountTabsComponent = (props: Props) => {
  const { appAccountDetails, style } = props;

  return (
    <div style={ { ...styles.container, ...style } }>
      <Tabs>
        <TabList>
          <Tab>{ `${appAccountDetails.totalArguments} Arguments` }</Tab>
          <Tab>{ `${appAccountDetails.totalAgrees} Agrees` }</Tab>
          <Tab>{ `${appAccountDetails.totalClaims} Claims` }</Tab>
        </TabList>
        <TabPanel>
          <AppAccountClaimsWithArgumentsTabPanel filter={ AppAccountArgumentsFilter.CREATED } appAccountId={ appAccountDetails.id } />
        </TabPanel>
        <TabPanel>
          <AppAccountClaimsWithAgreesTabPanel filter={ AppAccountArgumentsFilter.AGREED } appAccountId={ appAccountDetails.id } />
        </TabPanel>
        <TabPanel>
          <AppAccountClaimsCreatedTabPanel appAccountId={ appAccountDetails.id } />
        </TabPanel>
      </Tabs>

    </div>
  );
};

const styles = {
  container: { },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(AppAccountTabsComponent);
