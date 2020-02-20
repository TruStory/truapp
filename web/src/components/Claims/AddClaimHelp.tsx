import React, { CSSProperties } from 'react';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props {
  style?: CSSProperties;
}

const AddClaimHelp = (props: Props) => {

  const { style } = props;

  return (
    <div style={ { ...styles.container, ...style } }>
      <BaseText
        textSize={ TextSize.H3 }
        bold={ true }
      >
        Tips
      </BaseText>
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.LARGE + Whitespace.SMALL } } />
      <div className={ 'columns is-centered' }>
        <div className={ 'column is-6-desktop is-12-mobile' }>
          <div style={ styles.groupContainer } className={ 'is-6-desktop is-12-mobile' }>
            <BaseText color={ Color.APP_PURPLE } bold={ true }>Be Direct</BaseText>
            <BaseText>Concise claims lead to compelling debates</BaseText>
          </div>
          <div style={ styles.groupContainer } className={ 'is-6-desktop is-12-mobile' }>
            <BaseText color={ Color.APP_PURPLE } bold={ true }>Be Debatable</BaseText>
            <BaseText>Write claims that welcome discussion on both sides</BaseText>
          </div>
        </div>
        <div className={ 'column is-6-desktop is-12-mobile' }>
          <div style={ styles.groupContainer } className={ 'is-6-desktop is-12-mobile' }>
            <BaseText color={ Color.APP_PURPLE } bold={ true }>Don't Troll</BaseText>
            <BaseText>Be respectful and focus on the issue over identity</BaseText>
          </div>
          <div style={ styles.groupContainer } className={ 'is-6-desktop is-12-mobile' }>
            <BaseText color={ Color.APP_PURPLE } bold={ true }>Avoid Duplicates</BaseText>
            <BaseText>Make sure the claim hasn't been posted before</BaseText>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { },
  groupContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    marginBottom: Whitespace.LARGE,
    paddingRight: Whitespace.SMALL,
  },
};

export default AddClaimHelp;
