import * as React from 'react';
import { StyleProp, StyleSheet, View } from 'react-native';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { CommunityCoin } from 'shared/types/appAccount';

interface Props {
  style?: StyleProp<any> & React.CSSProperties;
  communityCoin: CommunityCoin;
  coinColor: Color;
  coinTextSize: TextSize;
  coinIconSize: IconSize;

}

const CommunityHoverCoinItem = (props: Props) => {
  const { communityCoin, style, coinColor, coinTextSize, coinIconSize } = props;
  const { community, coin  } = communityCoin;

  return (
    <View style={ [ styles.container, style ] }>
      <BaseIconImageView
        source={ community.iconImage.regular }
        size={ coinIconSize }
        style={ { marginRight: Whitespace.TINY } }
      />
      <BaseText
        textSize={ coinTextSize }
        color={ coinColor }
        align={ TextAlign.LEFT }
      >
        { coin.humanReadable }
      </BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
});

export default CommunityHoverCoinItem;
