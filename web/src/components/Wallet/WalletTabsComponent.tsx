import * as React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CommunityEarningsTabPanel from 'shared/components/Wallet/CommunityEarningsTabPanel';
import EarningsTabPanel from 'shared/components/Wallet/EarningsTabPanel';
import { Address } from 'shared/types/appAccount';
import 'web/src/styles/tabs.css';

interface Props {
  appAccountId: Address;
  style?: React.CSSProperties;
}

const WalletTabsComponent = (props: Props) => {
  const { appAccountId, style } = props;

  return (
    <div style={ { ...styles.container, ...style } }>
      <Tabs>
        <TabList>
          <Tab>{ `Earnings` }</Tab>
          <Tab>{ `Earnings Per Community` }</Tab>
        </TabList>
        <TabPanel>
          <EarningsTabPanel appAccountId={ appAccountId } />
        </TabPanel>
        <TabPanel>
          <CommunityEarningsTabPanel  appAccountId={ appAccountId } />
        </TabPanel>
      </Tabs>
    </div>
  );
};

const styles = {
  container :  { },
};

export default WalletTabsComponent;
