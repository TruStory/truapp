import React from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import CommunityCoinItem from 'shared/components/Communities/CommunityCoinItem';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isWeb } from 'shared/styles/utils';
import { CommunityCoin } from 'shared/types/appAccount';

interface Props {
  communityCoins: CommunityCoin[];
  titleColor: Color;
  titleSize: TextSize;
  coinColor: Color;
  coinSize: TextSize;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const CommunityCoinList = (props: Props) => {

  const { communityCoins, style, titleColor, titleSize, coinColor, coinSize } = props;
  const renderCommunityCoin = (rowData: ListRenderItemInfo<CommunityCoin>) => {
    return(
      <CommunityCoinItem
        communityCoin={ rowData.item }
        titleColor={ titleColor }
        titleSize={ titleSize }
        coinColor={ coinColor }
        coinSize={ coinSize }
      />
    );
  };

  return (
    <FlatList
      listKey={ Math.random().toString() }
      data={ communityCoins }
      renderItem={ renderCommunityCoin }
      contentContainerStyle={ [ styles.container, style, { justifyContent: 'space-between' } ] }
      style={ [ styles.container ] }
      numColumns={ 4 }
    />
  );

};

CommunityCoinList.defaultProps = {
  titleColor: Color.GRAY,
  titleSize: TextSize.H6,
  coinColor: Color.APP_BLACK,
  coinSize: TextSize.H4,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: isWeb() ? 'row' : 'column',
    flexWrap: 'wrap',
    flexGrow: 1,
    flex: 1,
  },
});

export default CommunityCoinList;
