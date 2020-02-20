import React, { useEffect, useRef } from 'react';
import { ScrollToProps } from 'shared/components/Argument/ScrollTo';
import { Whitespace } from 'shared/styles/views';
import { ViewHeights } from '../../styles';

const ScrollTo = (props: ScrollToProps) => {
  const { style, children, selectedId, id, container } = props;

  const selected = selectedId === id;

  const myRef = useRef<HTMLDivElement>(null);

  const getPosition = (element: any) =>  {
    var xPosition = 0;
    var yPosition = 0;

    while (element) {
      xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
      yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
      element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
  };

  useEffect(() => {
    if (selected && container && myRef && myRef.current) {
      const el = myRef.current;
      const position = getPosition(el);

      setTimeout(() => {
        container.scrollTo({ behavior: 'smooth', top: position.y - ViewHeights.HEADER - Whitespace.SMALL });
      }, 800);

    }
  }, [selected]);

  return (
    <div
      ref={ myRef }
      className={ selected ? 'highlight-background' : '' }
      style={ { ...styles.container, ...style } }
    >
      { children }
    </div>
  );

};

const styles = {
  container: { },
};

export default ScrollTo;
