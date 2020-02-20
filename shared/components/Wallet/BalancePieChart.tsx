import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Cell, Pie, PieChart } from 'recharts';
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

  const { settings, appAccountDetails } = props;

  const data = [
    { name: `Available ${settings.stakeDisplayDenom}`, value: parseInt(appAccountDetails.availableBalance.humanReadable), color: Color.APP_PURPLE },
    { name: `Invested ${settings.stakeDisplayDenom}`, value: parseInt(appAccountDetails.pendingBalance.humanReadable), color: Color.ORANGE },
  ];

// tslint:disable: jsx-no-multiline-js
  return (
    <View>
      <PieChart width={ 280 } height={ 300 }>
          <Pie
            data={ data }
            cx={ 130 }
            cy={ 150 }
            innerRadius={ 100 }
            outerRadius={ 120 }
            paddingAngle={ 5 }
            dataKey='value'
          >
            {
              data.map((entry, index) => <Cell key={ `cell-${index}` } fill={ entry.color } />)
            }
          </Pie>
      </PieChart>
      <View style={ { position: 'absolute', top: 105, left: 90 } }>
        <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: Whitespace.SMALL } }>
          <BaseText textSize={ TextSize.H6 } color={ Color.ORANGE }>Invested { settings.stakeDisplayDenom }</BaseText>
          <BaseText bold={ true } color={ Color.ORANGE }>{ appAccountDetails.pendingBalance.humanReadable } { settings.stakeDisplayDenom }</BaseText>
        </View>
        <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }>
          <BaseText textSize={ TextSize.H6 } color={ Color.APP_PURPLE }>Available { settings.stakeDisplayDenom }</BaseText>
          <BaseText bold={ true } color={ Color.APP_PURPLE }>{ appAccountDetails.availableBalance.humanReadable } { settings.stakeDisplayDenom }</BaseText>
        </View>
      </View>
    </View>
  );
};

const styles = {

};

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(BalancePieChart);
