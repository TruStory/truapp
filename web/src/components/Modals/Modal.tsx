import React, { CSSProperties } from 'react';
import { Color } from 'shared/styles/colors';
import { WebRadius, Whitespace } from 'shared/styles/views';
import { ViewWidths } from '../../styles';
import ModalBlanket from './ModalBlanket';

interface Props {
  backgroundColor? : Color;
  onHide?: () => void;
  children: React.ReactChild | React.ReactChild[];
  style?: CSSProperties;
}

const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

const Modal = (props: Props) => {
  const { children, onHide, backgroundColor, style } = props;

  return (
    <ModalBlanket onClick={ onHide }>
      <div style={ { ...styles.container, ...style } } className='modal-container'>
        { /* <img src={ close } style={ styles.close } /> */ }
        <div style={ { ...styles.main , backgroundColor } } onClick={ stopPropagation }>
          { children }
        </div>
      </div>
    </ModalBlanket>
  );
};

Modal.defaultProps = {
  backgroundColor: Color.WHITE,
};

const styles = {
  container: {
    boxSizing: 'border-box' as 'border-box',
    padding: Whitespace.TINY,
    margin: `0 auto`,
    maxWidth: ViewWidths.MODAL,
    position: 'relative' as 'relative',
  },
  close: {
    position: 'absolute' as 'absolute',
    right: Whitespace.TINY,
    top: -Whitespace.LARGE,
    height: Whitespace.MEDIUM,
    width: Whitespace.MEDIUM,
    cursor: 'pointer',
  },
  main: {
    backgroundColor: Color.WHITE,
    borderRadius: WebRadius.CARD,
  },
};

export default Modal;
