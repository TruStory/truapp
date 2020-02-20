import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import Header from 'web/src/components/Header/Header';
import Menu from 'web/src/components/Menu/Menu';
import LoginContentRoutes from '../Login/LoginContentRoutes';
import MainContentRoutes from './MainContentRoutes';

interface Props extends RouteComponentProps { }

const MainContent = (props: Props) => {
  const { location } = props;
  const [ menuOpen, setMenuOpen ] = React.useState( isLargerThanTablet() );

  React.useEffect(() => {
    const checkMenu = () => {
      if (menuOpen && window.innerWidth < 1100) {
        setMenuOpen(false);
      }
    };

    if (location.pathname.substr(0, 6) === '/claim') {
      setMenuOpen(false);
    }

    window.addEventListener('resize', checkMenu);
    return () => {
      window.removeEventListener('resize', checkMenu);
    };
  }, [location]);

  if (location.pathname.includes('login') ||
      location.pathname.includes('register') ||
      location.pathname.includes('recovery') ||
      location.pathname.includes('onboarding')
      ) {
    return <LoginContentRoutes />;
  }

  const onMenuToggled = () => setMenuOpen(!menuOpen);
  const onMenuItemClicked = () => {
    if (!isLargerThanTablet())
      setMenuOpen(false);
  };

  // if (isMobile) {
  //   const onClickMobile = () => {
  //     let url = AppConfig.ios_url;
  //     if (isAndroid) {
  //       url = AppConfig.android_url;
  //     }

  //     Linking.canOpenURL(url).then(supported => {
  //       if (supported) {
  //         Linking.openURL(url);
  //       }
  //     });
  //   };

  //   return (
  //     <div
  //       style={ {  overflow: 'hidden' ,  backgroundSize: '100% 100%' ,  backgroundImage: `url(${mobile_web_background})`, width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundRepeat: 'no-repeat' } }
  //     >
  //       <div style={ styles.centeredContainer }>
  //         <div style={ styles.textLogoContainer }>
  //           <img src={ mobile_web_logo } style={ { width: 100, marginBottom: Whitespace.LARGE * 3 } } />
  //           <BaseText
  //             color={ Color.WHITE }
  //             align={ TextAlign.CENTER }
  //             style={ { marginBottom: Whitespace.LARGE } }
  //           >
  //             Looks like you're on a phone. Download the app for the best experience.
  //           </BaseText>
  //           <BaseButton
  //             title={ 'Download' }
  //             width={ 200 }
  //             color={ Color.APP_PURPLE }
  //             accentColor={ Color.WHITE }
  //             onAction={ onClickMobile }
  //             outline={ false }
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div style={ styles.container }>
      <Header
        menuToggled={ onMenuToggled }
      />
      <div style={ styles.mainContainer }>
        <Menu
          open={ menuOpen }
          style={ styles.menuContainer }
          onMenuItemClicked={ onMenuItemClicked }
        />
        <div>
          <MainContentRoutes />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: 70,
  },
  menuContainer: {
    paddingTop: Whitespace.LARGE,
  },
  mainContainer: {
    margin: '0 auto',
  },
  centeredContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  textLogoContainer: {
    maxWidth: 300,
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',

  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withRouter(connect(mapStateToProps)(MainContent));
