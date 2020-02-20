import { store } from 'mobile/App';
import AnimatedScrollView from 'mobile/src/components/AnimatedScrollView';
import CommunitiesDetailedList from 'mobile/src/components/Communities/CommunitiesDetailedList';
import { headerStyles } from 'mobile/src/styles';
import React from 'react';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { withCollapsible } from 'react-navigation-collapsible';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseText from 'shared/components/Base/BaseText';
import { loginUser } from 'shared/services/auth';
import { Color } from 'shared/styles/colors';
import { ReactCollapsibleProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';

interface NavigationParams {
  onboardingStep: boolean;
}

interface Props extends NavigationScreenProps {
  collapsible: ReactCollapsibleProps;
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const SelectCommunitiesScreen = (props: Props) => {

  const { collapsible } = props;

  return(
    <AnimatedScrollView
      collapsible={ collapsible }
    >
      <CommunitiesDetailedList showDescription={ false } />
    </AnimatedScrollView>
  );
};

SelectCommunitiesScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {

  const onboardingStep = navigation.getParam('onboardingStep');

  const onDone = () => {
    Chain.onboard({ onboard_follow_communities: true });
    loginUser(store, true);
    navigation.dismiss();
  };

  const doneButtonJsx = (
    <BaseActionable onAction={ onDone } style={ { marginRight: Whitespace.MEDIUM } }>
      <BaseText color={ Color.APP_PURPLE }>Done</BaseText>
    </BaseActionable>
  );

  return {
    ...headerStyles,
    title: 'Select Communities',
    headerRight: onboardingStep ? doneButtonJsx : null,
  };
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withCollapsible(connect(mapStateToProps)(SelectCommunitiesScreen), { iOSCollapsedColor:  Color.WHITE });
