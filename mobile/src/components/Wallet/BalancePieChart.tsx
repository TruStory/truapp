import * as React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { connect } from 'react-redux';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { AppAccountBalanceDetails } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';

interface Props {
  settings: Settings;
  appAccountDetails: AppAccountBalanceDetails;
}

const BalancePieChart = (props: Props) => {

  const { appAccountDetails, settings } = props;

  const data = [
    { name: `Available ${settings.stakeDisplayDenom}`, value: parseInt(appAccountDetails.availableBalance.humanReadable), svg: { fill: Color.APP_PURPLE }, key: `pie-0` },
    { name: `Invested ${settings.stakeDisplayDenom}`, value: parseInt(appAccountDetails.pendingBalance.humanReadable), svg: { fill: Color.ORANGE }, key: `pie-1` },
  ];

// tslint:disable: jsx-no-multiline-js
  return (
    <View style={ { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Whitespace.TINY } }>
      <PieChart
        data={ data }
        innerRadius={ 40 }
        outerRadius={ 50 }
        style={ { height: 120, width: 120 } }
      />
      <View style={ { marginLeft: Whitespace.SMALL } }>
        <View style={ { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: Whitespace.SMALL } }>
          <BaseText textSize={ TextSize.H6 } color={ Color.ORANGE }>Invested { settings.stakeDisplayDenom }</BaseText>
          <BaseText bold={ true } color={ Color.ORANGE }>{ appAccountDetails.pendingBalance.humanReadable } { settings.stakeDisplayDenom }</BaseText>
        </View>
        <View style={ { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' } }>
          <BaseText textSize={ TextSize.H6 } color={ Color.APP_PURPLE }>Available { settings.stakeDisplayDenom }</BaseText>
          <BaseText bold={ true } color={ Color.APP_PURPLE }>{ appAccountDetails.availableBalance.humanReadable } { settings.stakeDisplayDenom }</BaseText>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(BalancePieChart);
