import * as React from 'react';
import { connect } from 'react-redux';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import { nanosecondsToDays } from 'shared/utils/duration';
import { generateDocumentTitle } from '../utils';

interface Props {
  settings: Settings;
}

const HowItWorksScreen = (props: Props) => {

  const { settings } = props;

  const interestRate = Math.floor((settings.interestRate / (365 / nanosecondsToDays(settings.period))) * 100);

  generateDocumentTitle('How To Play');

  return (
    <div style={ { ...styles.container } }>
      <div className={ 'columns is-centered' }>
        <div className={ 'column is-12-desktop' }>
          <div style={ { display: 'flex', flexDirection: 'column', marginTop: Whitespace.SMALL } }>
            <BaseText bold={ true } textSize={ TextSize.H2 }>How To Play</BaseText>
            <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
          </div>
        </div>
      </div>
      <div className={ 'columns is-centered' }>
        <div className={ 'column is-12-desktop' }>
          <div style={ { display: 'flex', alignItems: 'center' } }>
            <BaseIconView name={ 'target' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
            <BaseText bold={ true } textSize={ TextSize.H3 }>Objective</BaseText>
          </div>
          <div style={ styles.text }>
            <BaseText>Use { settings.stakeDisplayDenom } to become a Grand Master of Debates</BaseText>
          </div>
          <div style={ styles.header }>
            <BaseIconView name={ 'dollar-sign' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
            <BaseText bold={ true } textSize={ TextSize.H3 }>In-Game Currency</BaseText>
          </div>
          <div style={ styles.text }>
            <BaseText>{ settings.stakeDisplayDenom }</BaseText>
          </div>
          <div style={ styles.header }>
            <BaseIconView name={ 'trending-up' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
            <BaseText bold={ true } textSize={ TextSize.H3 }>How To Earn { settings.stakeDisplayDenom }</BaseText>
          </div>
          <div style={ styles.text }>
            <BaseText style={ { marginRight: 3 } }>1.</BaseText>
            <BaseText bold={ true } style={ { marginRight: 3 } }>Write</BaseText>
            <BaseText>
              an argument and invest { settings.argumentCreationStake.humanReadable } { settings.stakeDisplayDenom } on your argument. You're refunded your investment
              after { nanosecondsToDays(settings.period) } days and earn a { interestRate }% return rate on your investment.
            </BaseText>
          </div>
          <div style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
            <BaseText style={ { marginRight: 3 } }>2.</BaseText>
            <BaseText bold={ true } style={ { marginRight: 3 } }>Agree</BaseText>
            <BaseText>
              with an argument and invest { settings.upvoteStake.humanReadable } { settings.stakeDisplayDenom } on the argument. You're refunded
              your investment after { nanosecondsToDays(settings.period) } days and earn a { interestRate }% return rate on your investment - 1/3 goes to you and 2/3 goes to the argument writer.
            </BaseText>
          </div>
          <div style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
            <BaseText style={ { marginRight: 3 } }>3.</BaseText>
            <BaseText bold={ true } style={ { marginRight: 3 } }>Downvote</BaseText>
            <BaseText>
              a bad argument for free. If a threshold of players also downvote the same argument, you'll earn a portion of the total { settings.stakeDisplayDenom } that was invested on that argument to date.
            </BaseText>
          </div>
          <div style={ styles.header }>
            <BaseIconView name={ 'trending-down' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
            <BaseText bold={ true } textSize={ TextSize.H3 }>How To Lose { settings.stakeDisplayDenom }</BaseText>
          </div>
          <div style={ styles.text }>
            <BaseText>
              1. If an argument you wrote is downvoted by a threshold of players, you'll be penalized { settings.slashMagnitude }x the { settings.stakeDisplayDenom } you
              invested on the argument and any rewards you earned from that argument.
            </BaseText>
          </div>
          <div style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
            <BaseText>
              2. If an argument you agreed with is downvoted by a threshold of players, you'll be penalized { settings.slashMagnitude }x the { settings.stakeDisplayDenom } you
              invested on the argument and any rewards you earned from that argument.
            </BaseText>
          </div>
          <div style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
            <BaseText style={ { marginRight: 3 } }>
              3. If you are punished 3 times for writing or agreeing with a downvoted agreement, you will be
            </BaseText>
            <BaseText bold={ true } style={ { marginRight: 3 } }>put in timeout</BaseText>
            <BaseText>
              from TruStory for { nanosecondsToDays(settings.period) } days. Any rewards you would have earned on your investments will be forfeited.
            </BaseText>
          </div>
          <div style={ styles.header }>
            <BaseIconView name={ 'gift' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
            <BaseText bold={ true } textSize={ TextSize.H3 }>Starting Balance</BaseText>
          </div>
          <div style={ styles.text }>
            <BaseText>
              All players start with a balance of 300 { settings.stakeDisplayDenom }
            </BaseText>
          </div>
          <div style={ styles.header }>
            <BaseIconView name={ 'gift' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
            <BaseText bold={ true } textSize={ TextSize.H3 }>Min Balance</BaseText>
          </div>
          <div style={ styles.text }>
            <BaseText>
              All players are required to have a minimum balance of 50 { settings.stakeDisplayDenom }
            </BaseText>
          </div>
          <div style={ styles.header }>
            <BaseIconView name={ 'x-octagon' } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } color={ Color.APP_PURPLE } />
            <BaseText bold={ true } textSize={ TextSize.H3 }>Staking Limits</BaseText>
          </div>
          <div style={ styles.text }>
            <BaseText style={ { marginRight: 3 } }>
              Players have limits on how much they can have invested
            </BaseText>
            <BaseText bold={ true } style={ { marginRight: 3 } }>
              at once.
            </BaseText>
          </div>
          <div style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
            <BaseText style={ { marginRight: 3 } } bold={ true }>Staking Limit:</BaseText>
            <BaseText>500 { settings.stakeDisplayDenom }</BaseText>
          </div>
          <div style={ { ...styles.text, marginTop: Whitespace.LARGE } }>
            <BaseText>As players earn more { settings.stakeDisplayDenom }, staking limits are increased:</BaseText>
          </div>
          <div style={ { ...styles.text, marginTop: Whitespace.LARGE, display: 'flex', flexDirection: 'column' } }>
            <BaseText>10 { settings.stakeDisplayDenom } earned: 1,000 { settings.stakeDisplayDenom } limit</BaseText>
            <BaseText>20 { settings.stakeDisplayDenom } earned: 1,500 { settings.stakeDisplayDenom } limit</BaseText>
            <BaseText>30 { settings.stakeDisplayDenom } earned: 2,000 { settings.stakeDisplayDenom } limit</BaseText>
            <BaseText>40 { settings.stakeDisplayDenom } earned: 2,500 { settings.stakeDisplayDenom } limit</BaseText>
            <BaseText>50 { settings.stakeDisplayDenom } earned: 3,000 { settings.stakeDisplayDenom } limit</BaseText>
          </div>
          <div style={ { ...styles.text, marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } }>
            <BaseText>...and so on.</BaseText>
          </div>
        </div>
      </div>
    </div>
  );

};

const styles = {
  container: { },
  text: { paddingLeft: Whitespace.LARGE + Whitespace.SMALL, marginTop: Whitespace.TINY },
  header: { display: 'flex', alignItems: 'center', marginTop: Whitespace.LARGE + Whitespace.TINY },
  image: {
    width: '100%',
    marginTop: Whitespace.LARGE,
    marginBottom: Whitespace.MEDIUM,
    marginLeft: 0,
    marginRight: 0,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(HowItWorksScreen);
