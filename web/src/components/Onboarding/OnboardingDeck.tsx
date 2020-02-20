import Vimeo from '@u-wave/react-vimeo';
import * as React from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseButton from 'shared/components/Base/BaseButton';
import { slide_1 } from 'shared/images/Onboarding/OnboardingImages';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import BaseText from 'web/src/components/Base/BaseText';
import Modal from 'web/src/components/Modals/Modal';
import 'web/src/styles/slick.css';

interface Props {
  account?: Account;
  settings: Settings;
}

const OnboardingDeck = (props: Props) => {

  const { settings, account } = props;
  const sliderRef = React.useRef<Slider>(null);
  const [ show, setShow ] = React.useState(account && !account.userMeta.onboardCarousel);

  if (!show || !account) return null;

  const slider_settings = {
    dots: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    swipeToSlide: true,
    slidesToScroll: 1,
    arrows: false,
    lazyLoad: 'ondemand' as 'ondemand',
    infinite: false,
  };

  const onNext = () => sliderRef.current ? sliderRef.current.slickNext() : null;
  const onHide = () => {
    Chain.onboard({ onboard_carousel : true });
    setShow(false);
  };

  return (
    <Modal>
      <div>
        <Slider ref={ sliderRef } { ...slider_settings }>
          <div>
            <div style={ styles.card }>
              <img src={ slide_1 } style={ styles.image } />
              <BaseText bold={ true } textSize={ TextSize.H3 }>Welcome</BaseText>
              <BaseText
                align={ TextAlign.CENTER }
                style={ { marginTop: Whitespace.MEDIUM, paddingLeft: 16, paddingRight: 16 } }
                textSize={ TextSize.H3 }
              >
                TruStory is a social network to debate ideas
              </BaseText>
              <BaseButton
                title={ 'Take The Tour' }
                onAction={ onNext }
                accentColor={ Color.APP_PURPLE }
                color={ Color.APP_PURPLE }
                style={ { marginTop: Whitespace.LARGE, borderRadius: Whitespace.TINY } }
              />
              <BaseButton
                title={ 'Skip This' }
                outline={ true }
                accentColor={ Color.WHITE }
                hoverColors={ styles.hoverColors }
                onAction={ onHide }
                style={ { marginBottom: Whitespace.LARGE * 3 } }
              />
            </div>
          </div>
          <div>
            <div style={ { padding: Whitespace.MEDIUM } }>
              <div style={ styles.card }>
                <BaseText bold={ true } textSize={ TextSize.H3 } style={ { marginBottom: Whitespace.MEDIUM } }>{ settings.stakeDisplayDenom }</BaseText>
                <div style={ { width: '100%' } }>
                  <Vimeo
                    video={ '345599271' }
                    autoplay={ true }
                    loop={ true }
                    background={ true }
                    responsive={ true }
                  />
                </div>
                <BaseText
                  align={ TextAlign.CENTER }
                  style={ { marginTop: Whitespace.MEDIUM, paddingLeft: 16, paddingRight: 16 } }
                  textSize={ TextSize.H3 }
                >
                  { settings.stakeDisplayDenom } is your in-app currency. You earn { settings.stakeDisplayDenom } by writing Arguments, or Agreeing with the best ones.
                </BaseText>
                <BaseButton
                  title={ 'Next' }
                  onAction={ onNext }
                  accentColor={ Color.APP_PURPLE }
                  color={ Color.APP_PURPLE }
                  style={ { marginTop: Whitespace.LARGE, borderRadius: Whitespace.TINY, marginBottom: Whitespace.LARGE * 2 } }
                />
              </div>
            </div>
          </div>
          <div>
            <div style={ { padding: Whitespace.MEDIUM } }>
              <div style={ styles.card }>
                <BaseText bold={ true } textSize={ TextSize.H3 } style={ { marginBottom: Whitespace.MEDIUM } }>Agree</BaseText>
                <div style={ { width: '100%' } }>
                  <Vimeo
                    video={ '345599253' }
                    autoplay={ true }
                    loop={ true }
                    responsive={ true }
                    background={ true }
                    />
                </div>
                <BaseText
                  align={ TextAlign.CENTER }
                  style={ { marginTop: Whitespace.MEDIUM, paddingLeft: 16, paddingRight: 16 } }
                  textSize={ TextSize.H3 }
                >
                  If you find an argument you love, Agree with it! You earn rewards for surfacing the best Arguments.
                </BaseText>
                <BaseButton
                  title={ 'Next' }
                  onAction={ onNext }
                  accentColor={ Color.APP_PURPLE }
                  color={ Color.APP_PURPLE }
                  style={ { marginTop: Whitespace.LARGE, borderRadius: Whitespace.TINY } }
                />
              </div>
            </div>
          </div>
          <div>
            <div style={ { padding: Whitespace.MEDIUM } }>
              <div style={ styles.card }>
                <BaseText bold={ true } textSize={ TextSize.H3 } style={ { marginBottom: Whitespace.MEDIUM } }>Write Arguments</BaseText>
                <div style={ { width: '100%' } }>
                  <Vimeo
                    video={ '345599280' }
                    autoplay={ true }
                    loop={ true }
                    responsive={ true }
                    background={ true }
                    />
                </div>
                <BaseText
                  align={ TextAlign.CENTER }
                  style={ { marginTop: Whitespace.MEDIUM, paddingLeft: 16, paddingRight: 16 } }
                  textSize={ TextSize.H3 }
                >
                  Earn { settings.stakeDisplayDenom } by writing the best Arguments. The more people that Agree with your Argument, the more you earn!
                </BaseText>
                <BaseButton
                  title={ 'Next' }
                  onAction={ onNext }
                  accentColor={ Color.APP_PURPLE }
                  color={ Color.APP_PURPLE }
                  style={ { marginTop: Whitespace.LARGE, borderRadius: Whitespace.TINY } }
                />
              </div>
            </div>
          </div>
          <div>
            <div style={ { padding: Whitespace.MEDIUM } }>
              <div style={ styles.card }>
                <BaseText bold={ true } textSize={ TextSize.H3 } style={ { marginBottom: Whitespace.MEDIUM } }>Chat</BaseText>
                <div style={ { width: '100%' } }>
                  <Vimeo
                    video={ '345599265' }
                    autoplay={ true }
                    loop={ true }
                    responsive={ true }
                    background={ true }
                    />
                  </div>
                <BaseText
                  align={ TextAlign.CENTER }
                  style={ { marginTop: Whitespace.MEDIUM, paddingLeft: 16, paddingRight: 16 } }
                  textSize={ TextSize.H3 }
                >
                  Need a little warm-up before jumping into the debate? We got you! Spark a conversation in the live-chat, for free.
                </BaseText>
                <BaseButton
                  title={ `Let's Get Started!` }
                  onAction={ onHide }
                  accentColor={ Color.APP_PURPLE }
                  color={ Color.APP_PURPLE }
                  style={ { marginTop: Whitespace.LARGE, borderRadius: Whitespace.TINY } }
                />
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </Modal>
  );
};

const styles = {
  container: { },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  image: {
    marginTop: Whitespace.LARGE,
    marginBottom: Whitespace.LARGE,
    width: 300,
    height: '100%',
  },
  hoverColors: {
    hoverText: Color.APP_PURPLE,
    hoverBackground: Color.TRANSPARENT,
    regularBackground: Color.TRANSPARENT,
    regularText: Color.GRAY,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(OnboardingDeck);
