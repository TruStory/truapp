import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, SafeAreaView, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { truToast } from 'shared/components/Toast/TruToast';
import { logo_small } from 'shared/images/Logo/LogoImages';
import { TextAlign, TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';

interface NavigationParams {
  token: string;
  id: number;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const ProcessVerificationScreen = (props: Props) => {
  const { navigation } = props;
  const goLogin = () => navigation.popToTop();

  const verifyEmail = async() => {
    try {
      Analytics.track(AnalyticsEventsMobile.ConfirmationEmailClicked);
      const r = await Chain.verifyEmail({ id: +navigation.getParam('id'), token: navigation.getParam('token') });
      if (r.verified) {
        if (r.created && r.user) {
          const { address , group, userProfile } = r.user;
          Analytics.register(address, userProfile.fullName, userProfile.username, group, true);
        }
        goLogin();
      } else {
        goLogin();
      }
    } catch (err) {
      truToast(err.message);
      goLogin();
    }
  };

  React.useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView contentContainerStyle={ [ styles.container, { flexGrow: 1, paddingVertical: Whitespace.LARGE } ] }>
        <BaseIconImageView source={ logo_small } size={ 50 } />
        <BaseText
          style={ { maxWidth: 180, marginTop: Whitespace.LARGE } }
          bold={ true }
          textSize={ TextSize.H2 }
          align={ TextAlign.CENTER }
        >
          Verifying Your Email
        </BaseText>
        <BaseText style={ { maxWidth: 300, marginTop: Whitespace.LARGE, fontWeight: '200' } } align={ TextAlign.CENTER }>
          You will be directed to the login page once verification is complete
        </BaseText>
      </ScrollView>
    </SafeAreaView>
  );
};

ProcessVerificationScreen.navigationOptions = {
  header: null,
  title: ' ',
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(ProcessVerificationScreen);
