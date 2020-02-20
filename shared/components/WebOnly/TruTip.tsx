import * as React from 'react';
import { View } from 'react-native';

export interface TruTipText {
  title?: string;
  subtitle: string;
}

export interface TruTipProps {
  children: React.ReactNode;
  tip: TruTipText;
  clickable: boolean;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

const TruTip = (props: TruTipProps) => {

  const { children } = props;
  return (
      <View>
          { children }
      </View>
  );
};

TruTip.defaultProps = {
  clickable: false,
};

export default TruTip;
