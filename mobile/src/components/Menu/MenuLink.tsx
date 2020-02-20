import { Routes } from 'mobile/src/navigation/Routes';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { IconGroup } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';

interface Props extends NavigationScreenProps {
  style?: StyleProp<ViewStyle>;
  onClick?: () => void;
  path?: string;
  routeParams?: any;
  title: string;
  icon: IconGroup;
  color?: Color;
}

const MenuLink = (props: Props) => {

  const { style, path, title, icon, onClick, navigation, routeParams, color } = props;
  const { regular } = icon;

  const goToPath = () => {
    onClick ? onClick() : navigation.push(path ? path : Routes.Feed, routeParams);
    navigation.closeDrawer();
  };

  return (
    <BaseActionable
      style={ [ styles.container, style ] }
      onAction={ goToPath }
    >
      <BaseIconImageView
        source={ regular }
        size={ IconSize.XXSMALL }
        style={ { marginRight: Whitespace.SMALL } }
      />
      <BaseText color={ color } style={ { lineHeight: 16 } }>
        { title }
      </BaseText>
    </BaseActionable>
  );
};

MenuLink.defaultProps = {
  color: Color.APP_BLACK,
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: (Whitespace.LARGE + Whitespace.TINY) / 2,
    flexDirection: 'row',
  },
});

export default withNavigation(MenuLink);
