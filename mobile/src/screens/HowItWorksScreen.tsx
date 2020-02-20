import { headerStyles } from 'mobile/src/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import { nanosecondsToDays } from 'shared/utils/duration';

interface Props extends NavigationScreenProps {
  settings: Settings;
}

const HowItWorksScreen = (props: Props) => {
  const { settings } = props;

  const { interestRate } = settings;

  return (
    <ScrollView
      showsVerticalScrollIndicator={ false }
      contentContainerStyle={ [ styles.container, { flexGrow: 1, padding: Whitespace.LARGE, paddingTop: 0 } ] }
    >
      <View style={ [ styles.header, { marginTop: Whitespace.SMALL } ] }>
        <BaseIconView name={ 'target' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
        <BaseText bold={ true } textSize={ TextSize.H3 }>Objective</BaseText>
      </View>
      <BaseText style={ styles.text }>
        <BaseText>Use { settings.stakeDisplayDenom } to become a Grand Master of Debates</BaseText>
      </BaseText>
      <View style={ styles.header }>
        <BaseIconView name={ 'dollar-sign' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
        <BaseText bold={ true } textSize={ TextSize.H3 }>In-Game Currency</BaseText>
      </View>
      <BaseText style={ styles.text }>
        <BaseText>{ settings.stakeDisplayDenom }</BaseText>
      </BaseText>
      <View style={ styles.header }>
        <BaseIconView name={ 'trending-up' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
        <BaseText bold={ true } textSize={ TextSize.H3 }>How To Earn { settings.stakeDisplayDenom }</BaseText>
      </View>
      <BaseText style={ styles.text }>
        <BaseText>1. </BaseText>
        <BaseText bold={ true }>Write </BaseText>
        <BaseText>
          an argument and invest { settings.argumentCreationStake.humanReadable } { settings.stakeDisplayDenom } on your argument. You're refunded your investment
          after { nanosecondsToDays(settings.period) } days and earn a { interestRate }% return rate on your investment.
        </BaseText>
      </BaseText>
      <BaseText style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
        <BaseText>2. </BaseText>
        <BaseText bold={ true }>Agree </BaseText>
        <BaseText>
          with an argument and invest { settings.upvoteStake.humanReadable } { settings.stakeDisplayDenom } on the argument. You're refunded
          your investment after { nanosecondsToDays(settings.period) } days and earn a { interestRate }% return rate on your investment - 1/3 goes to you and 2/3 goes to the argument writer.
        </BaseText>
      </BaseText>
      <BaseText style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
        <BaseText>3. </BaseText>
        <BaseText bold={ true }>Downvote </BaseText>
        <BaseText>
          a bad argument for free. If a threshold of players also downvote the same argument, you'll earn a portion of the total { settings.stakeDisplayDenom } that was invested on that argument to date.
        </BaseText>
      </BaseText>
      <View style={ styles.header }>
        <BaseIconView name={ 'trending-down' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
        <BaseText bold={ true } textSize={ TextSize.H3 }>How To Lose { settings.stakeDisplayDenom }</BaseText>
      </View>
      <BaseText style={ styles.text }>
        <BaseText>
          1. If an argument you wrote is downvoted by a threshold of players, you'll be penalized { settings.slashMagnitude }x the { settings.stakeDisplayDenom } you
          invested on the argument and any rewards you earned from that argument.
        </BaseText>
      </BaseText>
      <BaseText style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
        <BaseText>
          2. If an argument you agreed with is downvoted by a threshold of players, you'll be penalized { settings.slashMagnitude }x the { settings.stakeDisplayDenom } you
          invested on the argument and any rewards you earned from that argument.
        </BaseText>
      </BaseText>
      <BaseText style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
        <BaseText>
          3. If you are punished 3 times for writing or agreeing with a downvoted agreement, you will be
        </BaseText>
        <BaseText bold={ true }> put in timeout </BaseText>
        <BaseText>
          from TruStory for { nanosecondsToDays(settings.period) } days. Any rewards you would have earned on your investments will be forfeited.
        </BaseText>
      </BaseText>
      <View style={ styles.header }>
        <BaseIconView name={ 'gift' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
        <BaseText bold={ true } textSize={ TextSize.H3 }>Starting Balance</BaseText>
      </View>
      <BaseText style={ styles.text }>
        <BaseText>
          All players start with a balance of 300 { settings.stakeDisplayDenom }
        </BaseText>
      </BaseText>
      <View style={ styles.header }>
        <BaseIconView name={ 'gift' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
        <BaseText bold={ true } textSize={ TextSize.H3 }>Min Balance</BaseText>
      </View>
      <BaseText style={ styles.text }>
        <BaseText>
          All players are required to have a minimum balance of 50 { settings.stakeDisplayDenom }
        </BaseText>
      </BaseText>
      <View style={ styles.header }>
        <BaseIconView name={ 'x-octagon' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
        <BaseText bold={ true } textSize={ TextSize.H3 }>Staking Limits</BaseText>
      </View>
      <BaseText style={ styles.text }>
        <BaseText>
          Players have limits on how much they can have invested
        </BaseText>
        <BaseText bold={ true }>
          at once.
        </BaseText>
      </BaseText>
      <BaseText style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
        <BaseText  bold={ true }>Staking Limit: </BaseText>
        <BaseText>500 { settings.stakeDisplayDenom }</BaseText>
      </BaseText>
      <BaseText style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
        <BaseText>As players earn more { settings.stakeDisplayDenom }, staking limits are increased:</BaseText>
      </BaseText>
      <BaseText style={ { ...styles.text, marginTop: Whitespace.LARGE, display: 'flex', flexDirection: 'column' } }>
        <BaseText>10 { settings.stakeDisplayDenom } earned: 1,000 { settings.stakeDisplayDenom } limit</BaseText>
        <BaseText>20 { settings.stakeDisplayDenom } earned: 1,500 { settings.stakeDisplayDenom } limit</BaseText>
        <BaseText>30 { settings.stakeDisplayDenom } earned: 2,000 { settings.stakeDisplayDenom } limit</BaseText>
        <BaseText>40 { settings.stakeDisplayDenom } earned: 2,500 { settings.stakeDisplayDenom } limit</BaseText>
        <BaseText>50 { settings.stakeDisplayDenom } earned: 3,000 { settings.stakeDisplayDenom } limit</BaseText>
      </BaseText>
      <BaseText style={ { ...styles.text, marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } }>
        <BaseText>...and so on.</BaseText>
      </BaseText>
    </ScrollView>
  );
};

HowItWorksScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  return {
    ...headerStyles,
    title: 'How To Play',
  };
};

const styles = StyleSheet.create({
  container: { },
  text: { paddingLeft: Whitespace.SMALL + Whitespace.LARGE, marginTop: Whitespace.TINY },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: Whitespace.LARGE + Whitespace.TINY },
});

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(HowItWorksScreen);
