import { Platform } from 'react-native';

export enum WebFontSize {
	H1 = 40,
	H2 = 22,
	H3 = 18,
	H4 = 16,
	H5 = 14,
	H6 = 12,
}

export enum WebLineHeight {
	H1 = 48,
	H2 = 32,
	H3 = 30,
	H4 = 28,
	H5 = 22,
	H6 = 18,
}

export enum MobileFontSize {
	H1 = 27,
	H2 = 21,
	H3 = 19,
	H4 = 16,
	H5 = 14,
  H6 = 12,
  T1 = 24,
}

export enum MobileLineHeight {
	H1 = 33,
	H2 = 26,
	H3 = 25,
	H4 = 22,
	H5 = 20,
  H6 = 16,
  T1 = 30,
}

export const FontFamily = {
  base: Platform.OS === 'ios' ? 'System' : 'roboto',
  serif: Platform.OS === 'ios' ? 'Lora' : 'lora_regular',
  tldr: Platform.OS === 'ios' ? 'System' : 'roboto',
};
