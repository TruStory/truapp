import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { IconGroup } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import BaseActionable from 'web/src/components/Base/BaseActionable';
import { HoverColors } from 'web/src/styles';

interface Props extends RouteComponentProps {
  style?: React.CSSProperties;
  onClick?: () => void;
  onClicked?: () => void;
  path: string;
  title: string;
  hoverColors?: HoverColors;
  icon: IconGroup;
}

const MenuLink = (props: Props) => {

  const { history, style, path, title, icon, onClicked, onClick, hoverColors } = props;
  const { regular, active } = icon;
  const { regularBackground, regularText, hoverBackground, hoverText } = hoverColors!;
  const [ hover, setHover ] = useState(false);

  const match = history.location.pathname === path;
  const backgroundColor = match ? Color.HIGHLIGHT_PURPLE : ( hover ? hoverBackground : regularBackground );
  const goToPath = () => {
    onClicked ? onClicked() : null;
    history.push(path);
  };

  const onMouseOver = () => setHover(true);
  const onMouseOut = () => setHover(false);

  return (
    <BaseActionable
      style={ { ...styles.container, backgroundColor, ...style } }
      onAction={ onClick ? onClick : goToPath }
      onMouseOut={ onMouseOut }
      onMouseOver={ onMouseOver }
    >
      <BaseIconImageView
        source={ match ? active : ( hover ? active : regular) }
        size={ IconSize.XSMALL }
        style={ { marginRight: Whitespace.SMALL } }
      />
      <BaseText color={  match ? Color.APP_PURPLE : ( hover ? hoverText : regularText ) }>
        { title }
      </BaseText>
    </BaseActionable>
  );
};

MenuLink.defaultProps = {
  hoverColors: {
    regularText: Color.APP_BLACK,
    regularBackground: Color.WHITE,
    hoverBackground: Color.HIGHLIGHT_PURPLE,
    hoverText: Color.APP_PURPLE,
  },
};

const styles = {
  container: {
    paddingTop: Whitespace.MEDIUM / 2,
    paddingLeft: Whitespace.MEDIUM,
    paddingRight: Whitespace.MEDIUM,
    paddingBottom: Whitespace.MEDIUM / 2,
    borderRadius: `0px ${Whitespace.LARGE}px ${Whitespace.LARGE}px 0px`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
};

export default withRouter(MenuLink);
