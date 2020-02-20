import Tippy from '@tippy.js/react';
import * as React from 'react';
import BaseText from 'shared/components/Base/BaseText';
import { TruTipProps } from 'shared/components/WebOnly/TruTip';
import { TextSize } from 'shared/styles';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import tippy from 'tippy.js';
import 'web/src/styles/tippy.css';

const TruTip = (props: TruTipProps) => {

  const { children, tip, style, containerStyle, clickable } = props;
  const { title, subtitle } = tip;

  const content = (
    <div style={ { ...styles.container, ...style } }>
      { title ? <div style={ styles.title }><BaseText bold={ true } textSize={ TextSize.H6 }>{ title }</BaseText></div> : null }
      { <BaseText textSize={ TextSize.H6 }>{ subtitle } </BaseText> }
    </div>
  );

  const onShow = () => tippy.hideAll({ duration: 0 });

  if (isLargerThanTablet()) {
    return (
      <Tippy
        content={ content }
        delay={ [300, 0] }
        theme={ 'light' }
        followCursor={ true }
        popperOptions={ { modifiers: { preventOverflow: { enabled : false }, hide: { enabled : false }  } } }
        onShow={ onShow }
      >
        <div style={ { ...styles.content, ...containerStyle, cursor: ( clickable ? 'pointer' : 'default' ) } }>
          { children }
        </div>
      </Tippy>
    );
  }
  return <div>{ children }</div>;
};

TruTip.defaultProps = {
  clickable: true,
};

const styles = {
  container: {
    display: 'flex',
    maxWidth: 200,
    flexDirection: 'column' as 'column',
    alignItems: 'flex-start',
    textAlign: 'left' as 'left',
    padding: Whitespace.MEDIUM,
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  title: {
    paddingBottom: Whitespace.TINY,
    width: '100%',
  },
};

export default TruTip;
