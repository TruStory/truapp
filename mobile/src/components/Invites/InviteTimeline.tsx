import React from 'react';
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import { invite_check, invite_option } from 'shared/images/Invite/InviteImages';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props {
  account?: Account;
  style?: StyleProp<ViewStyle>;
}

const InviteTimeline = (props: Props) => {
  const { account, style } = props;

  if (!account)
    return null;

  const width = Dimensions.get('screen').width;

  return (
    <View style={ [{ position: 'relative' }, style ] }>
      <View style={ styles.container }>
        <View style={ { alignItems: 'center', position: 'relative' } }>
          <BaseIconImageView
            source={ account.userMeta.journey &&  account.userMeta.journey.indexOf('signed_up') > -1 ? invite_check : invite_option }
            size={ 30 }
          />
          <BaseText style={ styles.label } align={ TextAlign.CENTER } textSize={ TextSize.H5 }>Verify Email</BaseText>
        </View>
        <View style={ { alignItems: 'center', position: 'relative' } }>
        <BaseIconImageView
            source={ account.userMeta.journey &&  account.userMeta.journey.indexOf('one_argument') > -1 ? invite_check : invite_option }
            size={ 30 }
          />
          <BaseText style={ styles.label } align={ TextAlign.CENTER } textSize={ TextSize.H5 }>Write Argument</BaseText>
        </View>
        <View style={ { alignItems: 'center', position: 'relative' } }>
        <BaseIconImageView
            source={ account.userMeta.journey &&  account.userMeta.journey.indexOf('received_five_agrees') > -1 ? invite_check : invite_option }
            size={ 30 }
          />
          <BaseText style={ styles.label } align={ TextAlign.CENTER } textSize={ TextSize.H5 }>Received 5 Agrees</BaseText>
        </View>
      </View>
      <BaseLine color={ Color.APP_PURPLE } style={ { position: 'absolute', top: 15, width: width - 100, left : 40, zIndex: 5 } } />
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', position: 'relative', zIndex: 100 },
  label: { marginTop: Whitespace.SMALL, width: 65 },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(InviteTimeline);
