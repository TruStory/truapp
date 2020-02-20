import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import squareLogo from 'web/src/images/squareLogo.svg';
import { generateDocumentTitle } from 'web/src/utils';
import CommunitiesDetailedList from '../../components/Communities/CommunitiesDetailedList';
import { Routes } from '../../navigation/Routes';
import { ViewWidths } from '../../styles';

interface Props extends RouteComponentProps {
  settings: Settings;
  account?: Account;
}

const FollowScreen = (props: Props) => {

  const { history } = props;

  generateDocumentTitle('Follow Communities');
  const goHome = () => {
    Chain.onboard({ onboard_follow_communities: true });
    history.push(Routes.HOME);
  };

  const onDone = () => {
    Analytics.track(AnalyticsEventsWeb.FinishedOnboardingCommunities);
    goHome();
  };
  const onSkip = () => {
    Analytics.track(AnalyticsEventsWeb.SkippedOnboardingCommunities);
    goHome();
  }
  ;  // const goLogin = () => history.push(Routes.LOGIN);

  return (
    <div style={ styles.container }>
      <div style={ { justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' } }>
        <BaseActionable onAction={ goHome } style={ { display: 'flex', cursor: 'pointer' } }>
          <img src={ squareLogo } alt='logo' style={ styles.mobileLogo } />
        </BaseActionable>
        <BaseText style={ { fontWeight: '200', maxWidth: 400, marginBottom: Whitespace.LARGE } } align={ TextAlign.CENTER }>
          Last step! Tell us what you're interested in.
        </BaseText>
        <BaseButton
          title={ 'Done' }
          onAction={ onDone }
          accentColor={ Color.APP_PURPLE }
          color={ Color.APP_PURPLE }
        />
        <BaseButton
          title={ 'skip' }
          outline={ true }
          accentColor={ Color.WHITE }
          hoverColors={ styles.skipColors }
          onAction={ onSkip }
          style={ { marginBottom: Whitespace.LARGE * 3 } }
        />
      </div>
      <div style={ styles.listContainer }>
        <CommunitiesDetailedList />
      </div>
    </div>
  );

};

const styles = {
  container: {
    maxWidth: ViewWidths.SITE,
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
  },
  mobileLogo: {
    width: 65,
  },
  skipColors: {
    hoverText: Color.APP_PURPLE,
    hoverBackground: Color.TRANSPARENT,
    regularBackground: Color.TRANSPARENT,
    regularText: Color.GRAY,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(FollowScreen);
