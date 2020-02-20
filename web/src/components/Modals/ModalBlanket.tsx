import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import React, { useEffect } from 'react';
import { Color } from 'shared/styles/colors';
import { Whitespace, ZIndex } from 'shared/styles/views';

interface Props {
  onClick?: () => void;
  children: React.ReactChild | React.ReactChild[];
}

const ModalBlanket = (props: Props) => {
  const { children, onClick } = props;

  const onBlanketClick = () =>  onClick && onClick();
  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      onBlanketClick();
    }
  };

  useEffect(() => {
    const element: HTMLElement | null = document.querySelector('.modal-blanket');

    if (element)
      disableBodyScroll( element );

    window.addEventListener('keydown', handleEscapeKeyDown);

    return () => {
      if (element)
        enableBodyScroll( element );

      window.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, []);

  return (
    <div style={ styles.blanket } onClick={ onBlanketClick } className='modal-blanket fade-in'>
      { children }
    </div>
  );
};

const styles = {
  blanket: {
    zIndex: ZIndex.BLANKET,
    position: 'fixed' as 'fixed',
    backgroundColor: Color.MODAL_BLANKET,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Whitespace.LARGE * 5,
    overflowY: 'auto' as 'auto',
    overflowX: 'hidden' as 'hidden',
    display: 'flex',
    overscrollBehavior: 'contain',
  },
};

export default ModalBlanket;
