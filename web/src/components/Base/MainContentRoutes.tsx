import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, RouteProps, Router, withRouter } from 'react-router-dom';
import { Account } from 'shared/blockchain/account';
import { Routes } from 'web/src/navigation/Routes';
import AddClaimScreen from 'web/src/screens/AddClaimScreen';
import ClaimScreen from 'web/src/screens/ClaimScreen';
import FeedScreen from 'web/src/screens/FeedScreen';
import HowItWorksScreen from 'web/src/screens/HowItWorksScreen';
import { ViewWidths } from 'web/src/styles';
import AppAccountScreen from '../../screens/AppAccountScreen';
import EditAppAccountScreen from '../../screens/EditAppAccountScreen';
import InviteAdminScreen from '../../screens/InviteAdminScreen';
import InviteScreen from '../../screens/InviteScreen';
import LeaderboardScreen from '../../screens/LeaderboardScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import SearchScreen from '../../screens/SearchScreen';
import SlashesScreen from '../../screens/SlashesScreen';
import ValuesScreen from '../../screens/ValuesScreen';
import WalletScreen from '../../screens/WalletScreen';
import LoginModal from '../Modals/LoginModal';
import OnboardingDeck from '../Onboarding/OnboardingDeck';

interface Props extends RouteComponentProps {
  account?: Account;
}

const MainContentRoutes = (props: Props) => {
  const { history, account } = props;

  const ProtectedRoute = (props: RouteProps) => {
    if (account) {
      return <Route { ...props } />;
    } else {
      return <Route { ...props } component={ LoginModal } />;
    }
  };

  return (
    <div style={ styles.container } className={ `columns is-centered main-content` }>
      <OnboardingDeck />
      <Router history={ history }>
        <div className={ 'switch-wrapper' }>
          <div>
            <Route path={ Routes.HOME } exact={ true } component={ FeedScreen } />
            <Route path={ Routes.HOW_IT_WORKS } component={ HowItWorksScreen } />
            <Route path={ Routes.VALUES } component={ ValuesScreen } />
            <Route path={ Routes.LEADERBOARD }  component={ LeaderboardScreen } />
            <Route path={ `${Routes.COMMUNITY}:communityId/:feedFilter?` } component={ FeedScreen } />
            <Route path={ `${Routes.SEARCH}:communityId?/:feedFilter?` } component={ SearchScreen } />
            <Route path={ `${Routes.CLAIM}:claimId` } component={ ClaimScreen } exact={ true } />
            <Route path={ `${Routes.CLAIM}:claimId${Routes.ARGUMENT}:selectedArgumentId?` } component={ ClaimScreen } exact={ true } />
            <Route path={ `${Routes.CLAIM}:claimId${Routes.ARGUMENT}:selectedArgumentId${Routes.HIGHLIGHT}:selectedHighlightId` } component={ ClaimScreen } exact={ true } />
            <Route path={ `${Routes.CLAIM}:claimId${Routes.COMMENT}:selectedCommentId?` } component={ ClaimScreen } />
            <Route path={ `${Routes.CLAIM}:claimId${Routes.COMMENT}:selectedCommentId${Routes.HIGHLIGHT}:selectedHighlightId` } component={ ClaimScreen } exact={ true } />
            <Route path={ `${Routes.CLAIM}:claimId${Routes.ARGUMENT}:selectedArgumentId${Routes.ELEMENT}:selectedElementId${Routes.COMMENT}:selectedCommentId` } component={ ClaimScreen } />
            <Route path={ `${Routes.PROFILE}:id` } component={ AppAccountScreen } />
            <ProtectedRoute path={ Routes.INVITES } component={ InviteScreen } />
            <ProtectedRoute path={ Routes.CREATE } component={ AddClaimScreen } />
            <ProtectedRoute path={ Routes.WALLET } component={ WalletScreen } />
            <ProtectedRoute path={ Routes.NOTIFICATIONS } component={ NotificationsScreen } />
            <ProtectedRoute path={ Routes.INVITES_ADMIN } component={ InviteAdminScreen } />
            <ProtectedRoute path={ Routes.SLASHES } component={ SlashesScreen } />
            <ProtectedRoute path={ Routes.SLASHES } component={ SlashesScreen } />
            <ProtectedRoute path={ Routes.EDIT_PROFILE } exact={ true } component={ EditAppAccountScreen } />
          </div>
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

export default withRouter(connect(mapStateToProps)(MainContentRoutes));
