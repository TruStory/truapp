import { Routes } from 'mobile/src/navigation/Routes';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { logo_small } from 'shared/images/Logo/LogoImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props extends NavigationScreenProps {
  account?: Account;
}

const AccountRecoverySentScreen = (props: Props) => {
  const { account, navigation } = props;

  const done = () => navigation.popToTop();

  React.useEffect(() => {
    if (account && account.address) {
      Chain.account = new Account(account);
      navigation.navigate(Routes.Main);
    }
  }, []);

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView
        showsVerticalScrollIndicator={ false }
        contentContainerStyle={ [ styles.container, { flexGrow: 1, padding: Whitespace.LARGE } ] }
      >
        <BaseIconImageView source={ logo_small } size={ 50 } />
        <BaseText
          style={ { maxWidth: 180, marginTop: Whitespace.SMALL, marginBottom: Whitespace.LARGE } }
          bold={ true }
          textSize={ TextSize.H2 }
        >
          Account Recovery
        </BaseText>
        <BaseText style={ { marginTop: Whitespace.LARGE, marginBottom: Whitespace.SMALL, fontWeight: '200' } }>
          Please check your email for a recovery password link. Follow the instructions using your web browser to set a new password and then come back to the app to login!
        </BaseText>
        <BaseButton
          title={ 'Sounds Good' }
          onAction={ done }
          accentColor={ Color.APP_PURPLE }
          color={ Color.APP_PURPLE }
          height={ 36 }
          width={ 150 }
          outline={ true }
          borderRadius={ Whitespace.LARGE }
          disabled={ false }
          textSize={ TextSize.H5 }
          style={ { marginTop: Whitespace.LARGE } }
        />
      </ScrollView>
      <BaseText
        color={ Color.LINE_GRAY }
        textSize={ TextSize.H6 }
        style={ { paddingTop: Whitespace.TINY } }
      >
        Copyright (C) Schelling Inc. 2019
      </BaseText>
    </SafeAreaView>
  );
};

AccountRecoverySentScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  return {
    header: null,
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    alignSelf: 'stretch',
    textAlignVertical: 'bottom',
    textAlign: 'center',
    padding: 0,
    paddingBottom: Whitespace.SMALL,
    borderBottomColor: Color.LINE_GRAY,
    borderBottomWidth: 1,
    marginTop: Whitespace.LARGE,
    fontWeight: '200',
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(AccountRecoverySentScreen);
