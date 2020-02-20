import * as React from 'react';
import AppConfig from 'shared/app-config.json';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import { slack } from 'shared/images/Brand/BrandImages';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import BaseButton from '../Base/BaseButton';

interface Props {
  title?: string;
  width?: number | string;
  style?: React.CSSProperties;
}

const SlackButton = (props: Props) => {

  const { title, width, style } = props;
  const onClick = () => {
    window.open(AppConfig.slack_url, '_blank');
  };

  const desktopIcon = (
    <BaseIconImageView
      source={ slack }
      size={ IconSize.XSMALL }
      style={ { marginLeft: Whitespace.TINY } }
    />
  );

  const mobileIcon = (
    <BaseIconImageView
      source={ slack }
      size={ IconSize.XSMALL }
    />
  );

  return (
    <React.Fragment>
      <div className='is-hidden-mobile is-flex-tablet'>
        <BaseButton
          outline={ false }
          hoverColors={ { regularBackground: Color.TRANSPARENT, regularText: Color.APP_PURPLE, hoverBackground: Color.SLACK, hoverText: Color.APP_PURPLE } }
          title={ title ? title : 'Join us on' }
          width={ width ? width : 150 }
          iconAlign={ 'right' }
          onAction={ onClick }
          style={ style }
          icon={ desktopIcon }
        />
      </div>
      <div className='is-hidden-tablet' style={ { alignItems: 'center' } }>
        <BaseButton
          outline={ false }
          hoverColors={ { regularBackground: Color.TRANSPARENT, regularText: Color.APP_PURPLE, hoverBackground: Color.SLACK, hoverText: Color.APP_PURPLE } }
          title={ '' }
          width={ 50 }
          onAction={ onClick }
          style={ style }
          icon={ mobileIcon }
        />
      </div>
    </React.Fragment>

  );
};

export default SlackButton;
