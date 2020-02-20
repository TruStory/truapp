import * as React from 'react';
import BaseText from 'shared/components/Base/BaseText';
import { Language } from 'shared/language';
import { TextSize } from 'shared/styles';
import SignInButton from './SignInButton';

interface Props {
  text?: string;
  textSize?: TextSize;
  style?: React.CSSProperties;
}

const SignInComponent = (props: Props) => {
  const { text, style, textSize } = props;

  return (
    <div style={ { ...styles.centeredRow, ... style } }>
      <div style={ {  ...styles.centeredItem, flex: 1 } }>
        <BaseText
          textSize={ textSize }
        >
          { text ? text : Language.SIGN_IN }
        </BaseText>
      </div>
      <div style={ { ...styles.centeredItem, justifyContent: 'flex-end' } } className={ 'is-hidden-mobile' }>
        <SignInButton />
      </div>
      <div style={ { ...styles.centeredItem, justifyContent: 'flex-end' } } className={ 'is-hidden-tablet' }>
        <SignInButton />
      </div>
    </div>
  );
};

const styles = {
  centeredRow: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  centeredItem: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
};

export default SignInComponent;
