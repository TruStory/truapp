import * as React from 'react';
import { Link } from 'react-router-dom';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily, WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import { TypographyProps } from 'shared/styles/props';

interface Props extends TypographyProps {
  textSize?: TextSize;
  href?: string;
  appLink?: string;
  target?: string;
  style?: React.CSSProperties;
  children: any;
  underline?: boolean;
}

const BaseATag = (props: Props) => {
  const { bold, color, align, children, fontFamily, style, target, href, appLink, underline } = props;
  const [ hover, setHover ] = React.useState(false);
  const fontWeight = bold ? 700 : 400;

  const textSize: any = props.textSize ? props.textSize : TextSize.H4;
  const textDecoration = hover && underline ? 'underline' : 'none';

  const incomingStyles = {
    textAlign: align,
    fontWeight,
    textDecoration,
    color,
    fontSize: WebFontSize[textSize],
    lineHeight: `${WebLineHeight[textSize]}px`,
    fontFamily,
    letterSpacing: 0.1,
  };

  const onMouseOut = () => { setHover(false); };
  const onMouseOver = () => { setHover(true); };

  if (appLink) {
    return(
      <Link
        to={ appLink }
        style={ { ...styles.container, ...incomingStyles, ...style } }
        onMouseOver={ onMouseOver }
        onMouseOut={ onMouseOut }
      >
        { children }
      </Link>

    );
  }

  return (
    <a
      onMouseOver={ onMouseOver }
      onMouseOut={ onMouseOut }
      href={ href ? href : '#' }
      target={ target ? target : '' }
      style={ { ...styles.container, ...incomingStyles, ...style } }
    >
      { children }
    </a>
  );
};

BaseATag.defaultProps = {
  bold: false,
  color: Color.APP_BLACK,
  fontFamily: FontFamily.base,
  align: TextAlign.DEFAULT,
  underline: true,
};

const styles = {
  container: {
    cursor: 'pointer',
  },
};

export default BaseATag;
