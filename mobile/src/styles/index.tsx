import * as React from 'react';
import { Platform } from 'react-native';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { Color } from 'shared/styles/colors';
import { FontFamily, MobileFontSize, MobileLineHeight } from 'shared/styles/fonts';
import { IconSize } from 'shared/styles/views';

export const headerStyles = {
  headerBackTitle: ' ',
  headerBackImage: <BaseIconView name={ 'chevron-left' } style={ Platform.OS === 'ios' ? { marginLeft: 6 } : { marginLeft: -6 } } size={ IconSize.REGULAR } />,
  headerTitleStyle: {
    fontFamily: FontFamily.base,
    fontSize: MobileFontSize.H4,
    lineHeight: MobileLineHeight.H4,
    color: Color.APP_BLACK,
    textAlign: 'center',
  },
  headerTintColor: Color.APP_BLACK,
  headerBackTitleStyle: {
    fontFamily: FontFamily.base,
    fontSize: MobileFontSize.H4,
    lineHeight: MobileLineHeight.H4,
    color: Color.APP_BLACK,
  },
  headerLayoutPreset: 'center',
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: Color.WHITE,
    elevation: 0,
    // shadowRadius: 3,
    // shadowOffset: { width: 0, height: 3 },
    // shadowColor: Color.APP_BLACK,
    zIndex: 10000,
    // shadowOpacity: 0.05,
  },
};
