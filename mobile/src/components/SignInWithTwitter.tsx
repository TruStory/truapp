import SecretConfig from 'mobile/secret-config.json';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { TwitterLoginResponse } from 'shared/types/twitter';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';
import TwitterAuth from 'tipsi-twitter';

interface Props {
  onClick: (response: TwitterLoginResponse | undefined) => void;
  style?: StyleProp<ViewStyle>;
  width?: string | number;
}

TwitterAuth.init(
  { twitter_key: SecretConfig.twitter.key, twitter_secret: SecretConfig.twitter.secret });

const SignInWithTwitter = (props: Props) => {
  const { width, style, onClick } = props;

  const icon = (
    <BaseIconView
      name={ 'twitter' }
      family={ 'Feather' }
      color={ Color.WHITE }
      size={ IconSize.XSMALL }
      style={ { marginRight: Whitespace.TINY, marginTop: 2 } }
    />
  );

  const onClickAction = async () => {
    Analytics.track(AnalyticsEventsMobile.SignUpWithTwitterClicked);
    const result: TwitterLoginResponse = await TwitterAuth.login();
    onClick(result);
  };

  return (
    <BaseButton
      accentColor={ Color.TWITTER_BLUE }
      color={ Color.WHITE }
      outline={ false }
      title={ 'Log In With' }
      iconAlign={ 'right' }
      textStyle={ { marginRight: Whitespace.TINY } }
      icon={ icon }
      onAction={ onClickAction }
      width= { width }
      style={ [ styles, style ] }
    />
  );
};

SignInWithTwitter.defaultProps = {
  width: 170,
};

const styles = StyleSheet.create({
  container: { },
});

export default SignInWithTwitter;
