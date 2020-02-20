import { History } from 'history';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { Account } from 'shared/blockchain/account';
import Analytics from 'shared/utils/analytics';
import AuthComplete from 'web/src/components/Header/AuthComplete';
import { Routes } from 'web/src/navigation/Routes';
import MainContent from '../components/Base/MainContent';
import AuthDenied from '../components/Header/AuthDenied';
import AuthNotWhitelisted from '../components/Header/AuthNotWhitelisted';

interface Props {
  account: Account;
  children: React.ReactNode | React.ReactNode[];
}

const debounceTrackClaim = debounce(Analytics.trackInternal, 300, { 'leading': true, 'trailing': false });
const debounceTrackArgument = debounce(Analytics.trackInternal, 300, { 'leading': true, 'trailing': false });

const trackRoutes = ({ history }: { history: History }) => {
  const { location } = history;

  // track opened claims
  const matchRoute = location.pathname.match(/\/claim\/(?<id>\d+)(\/argument\/(?<argumentId>\d+))?.*/);
  if (!(matchRoute && matchRoute.groups && matchRoute.groups.id)) {
    return null;
  }

  const id  = parseInt(matchRoute.groups.id);
  if (id > 0) {
    debounceTrackClaim(`claim_opened`, { claimId:  id });
  }
  const argumentId =  parseInt(matchRoute.groups.argumentId);
  if (argumentId > 0) {
    debounceTrackArgument('argument_opened',  { claimId:  id , argumentId : argumentId });
  }
  return null;
};
const NavigationStack = (props: Props) => {

  return (
    <BrowserRouter basename='/'>
      <div>
        { props.children }
        <Route path='/' render={ trackRoutes } />
        <Route path={ Routes.DEFAULT } component={ MainContent } />
        <Route path={ Routes.AUTH_COMPLETE } component={ AuthComplete } />
        <Route path={ Routes.AUTH_DENIED } component={ AuthDenied } />
        <Route path={ Routes.AUTH_NOT_WHITELISTED } component={ AuthNotWhitelisted } />
      </div>
    </BrowserRouter>
  );

};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(NavigationStack);
