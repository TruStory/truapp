import * as React from 'react';
import { Dimensions, StyleProp, StyleSheet, View } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isWeb } from 'shared/styles/utils';
import { CommunityCoin } from 'shared/types/appAccount';

interface Props {
  style?: StyleProp<any> & React.CSSProperties;
  communityCoin: CommunityCoin;
  titleColor: Color;
  titleSize: TextSize;
  coinColor: Color;
  coinSize: TextSize;
}

const CommunityCoinItem = (props: Props) => {
  const { communityCoin, style, titleColor, titleSize, coinColor, coinSize } = props;
  const { community, coin  } = communityCoin;

  const { width } = Dimensions.get('window');
  const itemWidth = (width - 20) / 4;

  return (
    <View style={ [ styles.container, style, { width: isWeb() ? 'auto' : itemWidth } ] }>
      <BaseText
        textSize={ coinSize }
        color={ coinColor }
        align={ TextAlign.CENTER }
        bold={ !isWeb() }
      >
        { coin.humanReadable }
      </BaseText>
      <BaseText
        color={ titleColor }
        textSize={ titleSize }
        align={ TextAlign.LEFT }
      >
        { community.id.toUpperCase() }
      </BaseText>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', alignItems: 'center' },
});

export default CommunityCoinItem;
