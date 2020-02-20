import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Router, withRouter } from 'react-router-dom';
import { Account } from 'shared/blockchain/account';
import { Routes } from 'web/src/navigation/Routes';
import LoginScreen from 'web/src/screens/Auth/LoginScreen';
import RegisterScreen from 'web/src/screens/Auth/RegisterScreen';
import VerifyScreen from 'web/src/screens/Auth/VerifyScreen';
import { ViewWidths } from 'web/src/styles';
import AccountRecovery from '../../screens/Auth/AccountRecovery';
import AccountRecoveryComplete from '../../screens/Auth/AccountRecoveryComplete';
import AccountRecoveryPasswordReset from '../../screens/Auth/AccountRecoveryPasswordReset';
import AccountRecoverySent from '../../screens/Auth/AccountRecoverySent';
import FollowScreen from '../../screens/Onboarding/FollowScreen';

interface Props extends RouteComponentProps {
  account?: Account;
}

const LoginContentRoutes = (props: Props) => {
  const { history } = props;

  // const ProtectedRoute = (props: RouteProps) => {
  //   if (account) {
  //     return <Route { ...props } />;
  //   } else {
  //     return <Route { ...props } component={ LoginModal } />;
  //   }
  // };

  // const mapStyles = (styles: any) => {
  //   return {
  //     opacity: styles.opacity,
  //     transform: `scale(${styles.scale})`,
  //   };
  // };

  // const bounce = (val: number) => {
  //   return spring(val, {
  //     stiffness: 330,
  //     damping: 22,
  //   });
  // };

  // const bounceTransition = {
  //   atEnter: {
  //     opacity: 0,
  //     scale: 1.2,
  //   },

  //   atLeave: {
  //     opacity: bounce(0),
  //     scale: bounce(0.8),
  //   },
  //   atActive: {
  //     opacity: bounce(1),
  //     scale: bounce(1),
  //   },
  // };

  return (
    <div style={ styles.container } className={ `columns is-centered main-content` }>
      <Router history={ history }>
        <div>
          <Route path={ Routes.LOGIN } exact={ true } component={ LoginScreen } />
          <Route path={ Routes.REGISTER } exact={ true } component={ RegisterScreen } />
          <Route path={ Routes.VERIFY } exact={ true } component={ VerifyScreen } />
          <Route path={ Routes.ACCOUNT_RECOVERY } exact={ true } component={ AccountRecovery } />
          <Route path={ Routes.ACCOUNT_RECOVERY_SENT } exact={ true } component={ AccountRecoverySent } />
          <Route path={ Routes.ACCOUNT_RECOVERY_RESET } exact={ true } component={ AccountRecoveryPasswordReset } />
          <Route path={ Routes.ACCOUNT_RECOVERY_RESET_COMPLETE } exact={ true } component={ AccountRecoveryComplete } />

          <Route path={ Routes.ONBOARDING_FOLLOW } exact={ true } component={ FollowScreen } />
        </div>
      </Router>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: ViewWidths.SITE,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withRouter(connect(mapStateToProps)(LoginContentRoutes));
