import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, TooltipPayload, XAxis, YAxis } from 'recharts';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import ChartDateFilterComponent from 'shared/components/Wallet/ChartDateFilterComponent';
import APP_ACCOUNT_EARNINGS_QUERY from 'shared/graphql/queries/app-account-earnings.query';
import AppAccountEarningsQuery, { AppAccountEarningsQueryData } from 'shared/graphql/types/AppAccountEarningsQuery';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Address } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';
import { ChartDateFilters } from 'shared/types/wallet';

interface Props {
  settings: Settings;
  appAccountId: Address;
}

const BalanceLineChart = (props: Props) => {

  const { settings, appAccountId } = props;
  const [ filter, setFilter ] = React.useState(ChartDateFilters.LAST_WEEK);

  const renderList = (result: QueryResult<AppAccountEarningsQueryData, any>) => {

    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const formatXAxis = (value: string) => { return new Date(value).toDateString(); };
    const formatTooltip = (entry: TooltipPayload) => {
      if (!entry.payload[0] || entry.payload[0].payload.length === 0) return null;

      return (
        <View style={ styles.tooltipStyle }>
          <BaseText style={ { marginBottom: Whitespace.SMALL } }>Available { settings.stakeDisplayDenom }</BaseText>
          <View style={ { flexDirection: 'row' } }>
            <BaseText bold={ true } style={ { flex: 1, alignItems: 'flex-start' } }>Date</BaseText>
            <BaseText style={ { alignItems: 'flex-end' } }>{ new Date(entry.payload[0].payload.date).toDateString() }</BaseText>
          </View>
          <View style={ { flexDirection: 'row' } }>
            <BaseText bold={ true } style={ { flex: 1, alignItems: 'flex-start' } }>Amount</BaseText>
            <BaseText style={ { alignItems: 'flex-end' } } color={ Color.APP_PURPLE }>{ `${entry.payload[0].payload.amount} ${settings.stakeDisplayDenom}` }</BaseText>
          </View>
        </View>
      );
    };

    const setFilterValue = (filter: ChartDateFilters) => setFilter(filter);
    let minValue = Number.MAX_SAFE_INTEGER;
    let maxValue = 0;
    data.appAccountEarnings.dataPoints.forEach(({ amount }) => {
      minValue = Math.min(minValue, amount);
      maxValue = Math.max(maxValue, amount);
    });

  // tslint:disable: jsx-no-multiline-js
    return (
      <View>
        <View style={ styles.header }>
          <BaseText
            bold={ true }
            style={ {  flex: 1 } }
          >
            { `Net Earnings: ${data.appAccountEarnings.netEarnings.humanReadable} ${ settings.stakeDisplayDenom }` }
          </BaseText>
          <ChartDateFilterComponent onChange={ setFilterValue } value={ filter } />
        </View>
        <ResponsiveContainer height={ 300 } width='100%'>
          <LineChart
            height={ 300 }
            data={ data.appAccountEarnings.dataPoints }
            margin={ {
              top: 5, right: 30, left: 20, bottom: 5,
            } }
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey={ 'date' }
              tickFormatter={ formatXAxis }
              tick={ { fontSize: 12, fill: Color.APP_BLACK } }
              stroke={ 'transparent' }
            />
            <YAxis
              orientation={ 'left' }
              tick={ { fontSize: 12, fill: Color.APP_PURPLE } }
              stroke={ 'transparent' }
              domain={ [
                Math.max(Math.floor(minValue - ((maxValue - minValue) / 4)), 0),
                Math.ceil(maxValue + ((maxValue - minValue) / 4)),
              ] }
            />
            <Tooltip
              cursor={ true }
              content={ formatTooltip }
            />
            <Line
              type='monotone'
              dataKey={ 'amount' }
              name={ 'Amount' }
              unit={ ` ${settings.stakeDisplayDenom}` }
              stroke={ Color.APP_PURPLE }
              strokeWidth={ 3 }
              dot={ true }
              isAnimationActive={ true }
            />
          </LineChart>
        </ResponsiveContainer>
      </View>
    );
  };

  const to = (new Date(Date.now())).toISOString().substr(0, 10);
  const d = new Date();
  if (filter === ChartDateFilters.LAST_WEEK) {
    d.setDate(d.getDate() - 7);
  } else if (filter === ChartDateFilters.LAST_MONTH) {
    d.setDate(d.getDate() - 30);
  } else if (filter === ChartDateFilters.LAST_YEAR) {
    d.setDate(d.getDate() - 365);
  } else {
    d.setDate(d.getDate() - 365);
  }
  const from = d.toISOString().substr(0, 10);

  return (
    <AppAccountEarningsQuery
      query={ APP_ACCOUNT_EARNINGS_QUERY }
      variables={ { id: appAccountId, from, to } }
      fetchPolicy='network-only'
    >
      { renderList }
    </AppAccountEarningsQuery>
  );
};

const styles = StyleSheet.create({
  tooltipStyle: {
    width: 250,
    padding: 10,
    backgroundColor: Color.WHITE,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.125,
    shadowColor: Color.APP_BLACK,
  },
  header: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginBottom: Whitespace.LARGE,
    position: 'relative',
    zIndex: 100,
  },
});

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(BalanceLineChart);
