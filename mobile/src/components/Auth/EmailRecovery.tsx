import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Chain from 'shared/blockchain';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { truToast } from 'shared/components/Toast/TruToast';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';

interface Props {
  identifier: string;
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  onEmailSent: () => void;
}

const EmailRecovery = (props: Props) => {
  const { onEmailSent, identifier, visible, style } = props;

  const resendEmail = async() => {
    LoadingBlanketHandler.show();
    try {
      await Chain.resendVerificationEmail({ identifier });
      onEmailSent();
      truToast(`A recovery email has been sent to the email or username associated with: ${identifier}`);
    } catch (err) {
      truToast(err.message);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  return (
    <View style={ [ styles.container, { display: visible ? 'flex' : 'none' }, style ] }>
      <BaseText color={ Color.RED } textSize={ TextSize.H6 } style={ { marginRight: 3 } }>
        This email has already been registered, but not verified.
      </BaseText>
      <BaseActionable onAction={ resendEmail }>
        <BaseText color={ Color.RED } bold={ true } textSize={ TextSize.H6 } style={ { textDecorationLine: 'underline' } } >Resend Link?</BaseText>
      </BaseActionable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

export default EmailRecovery;
