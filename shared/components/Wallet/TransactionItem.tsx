import BigNumber from 'bignumber.js';
import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import BaseText from 'shared/components/Base/BaseText';
import { Settings } from 'shared/types/settings';
import { Transaction } from 'shared/types/transactions';
import { TextSize } from '../../styles';
import { Color } from '../../styles/colors';
import { Whitespace } from '../../styles/views';
import BaseIconView from '../Base/BaseIconView';
import TimerComponent from '../TimerComponent';

interface Props {
  settings: Settings;
  transaction: Transaction;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const TransactionItem = (props: Props) => {
  const { settings, transaction, style } = props;
  const { amount, reference, createdTime } = transaction;
  const{ body, title } = reference;

  const bigAmount = new BigNumber(amount.amount);
  const positive = bigAmount.isGreaterThan(0);

  return (
    <View style={ [ styles.container, style ] }>
      <View style={ { flexDirection: 'column' } }>
        <View style={ { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' } }>
          <BaseText bold={ true } color={ Color.APP_PURPLE }>{ title }</BaseText>
          <BaseIconView
            family={ 'Material' }
            color={ Color.GRAY }
            size={ 5 }
            name={ 'fiber-manual-record' }
            style={ { marginLeft: Whitespace.TINY, marginRight: Whitespace.TINY } }
          />
          <TimerComponent
            showElapsedLabel={ true }
            color={ Color.GRAY }
            endTime={ createdTime }
            size={ TextSize.H6 }
            showFullTime={ true }
          />
        </View>
        <View style={ { flexDirection: 'row', alignItems: 'flex-end' } }>
          <BaseText style={ { flex: 1, marginRight: Whitespace.LARGE * 2 } }>{ body }</BaseText>
          <BaseText color={ positive ? Color.GREEN : Color.RED } bold={ true }>
            { `${positive ? '+' : '' }${amount.humanReadable} ${settings.stakeDisplayDenom}` }
          </BaseText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(TransactionItem);
