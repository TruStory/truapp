import React from 'react';
import BaseText from 'shared/components/Base/BaseText';
import { ClaimTextProps } from 'shared/components/Claim/ClaimText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily } from 'shared/styles/fonts';

const ClaimText = (props: ClaimTextProps) => {

  const { claim, style, textSize } = props;
  const { body } = claim;

  return (
    <div style={ { ...styles.container, ...style } } className={ 'claim-text' }>
      <BaseText
        color={ Color.APP_BLACK }
        textSize={ textSize }
        fontFamily={ FontFamily.serif }
        style={ { lineHeight: '50px' } }
      >
        { body }
      </BaseText>
    </div>
  );

};

ClaimText.defaultProps = {
  textSize: TextSize.H1,
};

const styles = {
  container: { },
};

export default ClaimText;
