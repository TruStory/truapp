import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import BaseActionable from 'shared/components/Base/BaseActionable';
import { Creator } from 'shared/types/appAccount';

interface Props extends NavigationScreenProps {
  appAccount: Creator;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const OpenProfile = (props: Props) => {
  const { appAccount, children, style, navigation } = props;

  const navigateToProfile = () => navigation.navigate({
    routeName: 'AppAccount',
    params: { accountId: appAccount.id },
    key: `AppAccount-${appAccount.id}`,
  });

  return (
    <BaseActionable style={ [ styles.container, style ] } onAction={ navigateToProfile }>
      { children }
    </BaseActionable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default withNavigation(OpenProfile);
