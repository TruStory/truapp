import CloseButton from 'mobile/src/components/Buttons/CloseButton';
import TrustoryMarkdown from 'mobile/src/components/Markdown/TrustoryMarkdown';
import { headerStyles } from 'mobile/src/styles';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, ScrollView } from 'react-navigation';
import BaseText from 'shared/components/Base/BaseText';
import { Whitespace } from 'shared/styles/views';

interface NavigationParams {
  text: string;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const PreviewScreen = (props: Props) => {

  const { navigation } = props;
  const text = navigation.getParam('text');

  return(
    <ScrollView style={ [ styles.container ] }>
      <TrustoryMarkdown>{ text }</TrustoryMarkdown>
    </ScrollView>
  );
};

PreviewScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  return {
    ...headerStyles,
    headerLeft: (
      <BaseText style={ { marginLeft: Whitespace.SMALL } } bold={ true }>Preview</BaseText>
    ),
    headerRight: <CloseButton position={ 'right' } />,
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

export default PreviewScreen;
