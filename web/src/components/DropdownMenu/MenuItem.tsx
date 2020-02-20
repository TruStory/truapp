import React, { CSSProperties, useState } from 'react';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { IconGroup, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import BaseActionable from 'web/src/components/Base/BaseActionable';
import { HoverColors } from 'web/src/styles';

interface Props {
  style?: CSSProperties;
  icon: IconGroup;
  hoverColors: HoverColors;
  children: React.ReactText;
  onClick: () => void;
}

const MenuItem = (props: Props) => {
  const { children, onClick, style, icon, hoverColors } = props;
  const { regular, active } = icon;
  const { regularBackground, regularText, hoverBackground, hoverText } = hoverColors;
  const [ hover, setHover ] = useState(false);

  const onMouseOver = () => setHover(true);
  const onMouseOut = () => setHover(false);

  const backgroundColor = hover ? hoverBackground : regularBackground;

  return (
    <BaseActionable
      style={ { ...styles.container, backgroundColor, ...style } }
      onAction={ onClick }
      onMouseOver={ onMouseOver }
      onMouseOut={ onMouseOut }
    >
      <BaseIconImageView source={ hover ? active : regular } size={ IconSize.XSMALL } style={ { marginRight: Whitespace.SMALL } } />
      <BaseText textSize={ TextSize.H5 } color={ hover ? hoverText : regularText }>{ children }</BaseText>
    </BaseActionable>
  );
};

MenuItem.defaultProps = {
  hoverColors: {
    regularText: Color.APP_BLACK,
    regularBackground: Color.WHITE,
    hoverBackground: Color.HIGHLIGHT_PURPLE,
    hoverText: Color.APP_PURPLE,
  },
};

const styles = {
  container: {
    alignItems: 'center',
    padding: `${Whitespace.MEDIUM}px ${Whitespace.MEDIUM}px`,
    display: 'flex',
    cursor: 'pointer',
    width: '100%',
  },
};

export default MenuItem;
