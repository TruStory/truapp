import { headerStyles } from 'mobile/src/styles';
import React, { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, ScrollView } from 'react-navigation';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { invite_details_image } from 'shared/images/Invite/InviteImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { AppAccount } from 'shared/types/appAccount';
import { UserJourney } from 'shared/types/journey';
import { journeyMatchMap } from 'shared/utils/journey';

interface NavigationParams {
  appAccount: AppAccount;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const InviteDetailsScreen = (props: Props) => {
  const { navigation } = props;
  const appAccount = navigation.getParam('appAccount');

  const renderInviteStatus = () => {
    let statusJsx: ReactNode[] = [];

    journeyMatchMap.forEach((value: string, key: UserJourney) => {
      statusJsx.push(
        <View style={ { flexDirection: 'row', justifyContent: 'space-between', marginTop: Whitespace.MEDIUM } }>
          <BaseText>{ value }</BaseText>
          { appAccount.userJourney.indexOf(key) !== -1 && <BaseIconView name={ 'check' } color={ Color.APP_PURPLE } /> }
        </View>,
      );
    });

    return statusJsx;
  };

  return(
    <React.Fragment>
      <ScrollView style={ [ styles.container ] }>
        <BaseText textSize={ TextSize.H1 } bold={ true }>Invitation to</BaseText>
        <BaseText textSize={ TextSize.H1 }>{ appAccount.userProfile.username }</BaseText>
        <BaseText style={ { marginTop: Whitespace.LARGE } } bold={ true }>Accomplishments</BaseText>
          { renderInviteStatus() }
      </ScrollView>
      <Image source={ invite_details_image } />
    </React.Fragment>
  );
};

InviteDetailsScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams>}) => {
  return {
    ...headerStyles,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: Whitespace.SMALL,
    paddingRight: Whitespace.SMALL,
    paddingTop: Whitespace.MEDIUM,
  },
});

export default InviteDetailsScreen;
