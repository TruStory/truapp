import React from 'react';
import { RouteComponentProps } from 'react-router';
import BaseText from 'shared/components/Base/BaseText';
import { Language } from 'shared/language';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { WebRadius, Whitespace } from 'shared/styles/views';
import loginBackground from 'web/src/images/loginBackground.png';
import logoIcon from 'web/src/images/logo.png';
import logo from 'web/src/images/logo.svg';
import { Routes } from '../../navigation/Routes';
import ModalBlanket from './ModalBlanket';

const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

const LoginModal = (props: RouteComponentProps) => {
  const { history } = props;

  history.push(Routes.LOGIN);

  const goBack = () => history.goBack();

  return (
    <ModalBlanket onClick={ goBack }>
      <div style={ styles.container } onClick={ stopPropagation } className='modal-container'>
        <div style={ styles.leftCell }>
          <img src={ logoIcon } style={ styles.icon } />
        </div>
        <div style={ styles.rightCell }>
          <div>
            <img src={ logo } style={ styles.logoText } />
          </div>
          <BaseText textSize={ TextSize.H2 } bold={ true }>{ Language.BRAND_MESSAGE_TAGLINE }</BaseText>
        </div>
      </div>
    </ModalBlanket>
  );
};

const MODAL_WIDTH = 680;
const MODAL_HEIGHT = 395;

const styles = {
  container: {
    margin: '0 auto',
    maxHeight: 'calc(100vh - 160px)',
    overflow: 'auto',
    position: 'relative' as 'relative',
    height: MODAL_HEIGHT,
    marginBottom: Whitespace.LARGE,
    display: 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'stretch',
    backgroundColor: Color.WHITE,
    bordeRadius: WebRadius.CARD,
  },
  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  leftCell: {
    background: `url(${loginBackground}) no-repeat`,
    backgroundSize: `${MODAL_WIDTH / 2}px ${MODAL_HEIGHT}px`,
    width: MODAL_WIDTH / 2,
    backgroundColor: '#515151',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 140,
  },
  logoText: {
    width: 120,
  },
  rightCell: {
    boxSizing: 'border-box' as 'border-box',
    textAlign: 'center' as 'center',
    padding: Whitespace.LARGE + Whitespace.MEDIUM,
    width: MODAL_WIDTH / 2,
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between',
  },
};

export default LoginModal;
