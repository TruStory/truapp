import React from 'react';
import { StyleSheet } from 'react-native';
import { RouteComponentProps, withRouter } from 'react-router';
import BaseText from 'shared/components/Base/BaseText';
import { ClaimSourceProps } from 'shared/components/Claim/ClaimSource';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import DateUtil from 'shared/utils/date';
import ValidationUtil from 'shared/utils/validation';
import BaseATag from 'web/src/components/Base/BaseATag';
import { Routes } from 'web/src/navigation/Routes';
import AppAccountLink from '../AppAccount/AppAccountLink';

interface Props extends RouteComponentProps, ClaimSourceProps { }

const ClaimSource = (props: Props) => {

  const { claim, style } = props;
  const { community, creator, createdTime, source } = claim;

  const processSource = () => {
    if (!source || source.trim() === '' || !ValidationUtil.validateUrl(source))
      return null;

    const url = new URL(source);
    return (
      <React.Fragment>
        <BaseText
          textSize={ TextSize.H5 }
          color={ Color.GRAY }
          style={ { marginRight: 3 } }
        >
          /
        </BaseText>
        <BaseATag
          target={ '_blank' }
          href={ source }
          textSize={ TextSize.H5 }
          color={ Color.APP_PURPLE }
        >
          { `${url.hostname}` }
        </BaseATag>
      </React.Fragment>
    );
  };

  return (
    <div style={ { ...styles.container, ...StyleSheet.flatten(style) } } key={ claim.id }>
      <BaseATag
        appLink={ `${Routes.COMMUNITY}${community.id}` }
        textSize={ TextSize.H5 }
        color={ Color.GRAY }
        style={ { marginRight: 3 } }
      >
        { community.name }
      </BaseATag>
      <BaseText
        textSize={ TextSize.H5 }
        color={ Color.GRAY }
        style={ { marginRight: 3 } }
      >/
      </BaseText>
      <AppAccountLink color={ Color.GRAY } appAccount={ creator } style={ { marginRight: 3 } } />
      <BaseText
        textSize={ TextSize.H5 }
        color={ Color.GRAY }
        style={ { marginRight: 3 } }
      >
        on { DateUtil.format(createdTime) }
      </BaseText>
      { source ? processSource() : null }
    </div>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap' },
});

export default withRouter(ClaimSource);
