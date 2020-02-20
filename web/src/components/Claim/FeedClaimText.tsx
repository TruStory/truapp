import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ClaimTextProps } from 'shared/components/Claim/ClaimText';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Routes } from '../../navigation/Routes';
import BaseText from '../Base/BaseText';

interface Props extends ClaimTextProps, RouteComponentProps { }

const FeedClaimText = (props: Props) => {

  const { claim, style, textSize } = props;

  return (
    <div style={ { ...styles.container, ...style } }>
      <BaseText
        textSize={ TextSize.H5 }
        color={ Color.APP_PURPLE }
      >
        Claim
      </BaseText>
      <BaseATag
        color={ Color.APP_BLACK }
        textSize={ textSize }
        bold={ true }
        underline={ false }
        appLink={ `${Routes.CLAIM}${claim.id}` }
      >
        { claim.body }
      </BaseATag>
    </div>
  );
};

FeedClaimText.defaultProps = {
  textSize: TextSize.H2,
};

const styles = {
  container: { display: 'flex', flexDirection: 'column' },
};

export default withRouter(FeedClaimText);
