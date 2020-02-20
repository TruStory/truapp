import { calculateNoHeaderKeyboardOffset } from 'mobile/src/utils/keyboard';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { NavigationScreenProps, SafeAreaView, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { logo_small } from 'shared/images/Logo/LogoImages';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props extends NavigationScreenProps {
  account?: Account;
}

const VerifyScreen = (props: Props) => {
  const { navigation } = props;
  const goLogin = () => navigation.popToTop();

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        style={ styles.container }
        behavior={ 'padding' }
        enabled={ Platform.OS === 'ios' }
        keyboardVerticalOffset={ calculateNoHeaderKeyboardOffset() }
      >
        <ScrollView contentContainerStyle={ [ styles.container, { flexGrow: 1, paddingVertical: Whitespace.LARGE } ] }>
          <BaseIconImageView source={ logo_small } size={ 50 } />
          <BaseText
            style={ { maxWidth: 180, marginTop: Whitespace.LARGE } }
            bold={ true }
            textSize={ TextSize.H2 }
            align={ TextAlign.CENTER }
          >
            Verify Your Email
          </BaseText>
          <BaseText style={ { maxWidth: 180, marginTop: Whitespace.LARGE, fontWeight: '200' } }>
            Welcome to TruStory!
          </BaseText>
          <BaseText
            align={ TextAlign.CENTER }
            style={ { maxWidth: 300, marginTop: Whitespace.TINY, marginBottom: Whitespace.LARGE, fontWeight: '200' } }
          >
            Please verify your email address. You will need to confirm your email to use your account.
          </BaseText>
          <View style={ { justifyContent: 'center', marginTop: Whitespace.LARGE } }>
            <BaseButton
              title={ 'Sounds Good' }
              accentColor={ Color.APP_PURPLE }
              color={ Color.APP_PURPLE }
              onAction={ goLogin }
              width={ 150 }
              height={ 36 }
              outline={ true }
              disabled={ false }
              textSize={ TextSize.H5 }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

VerifyScreen.navigationOptions = {
  header: null,
  title: ' ',
};

export default connect(mapStateToProps)(VerifyScreen);
