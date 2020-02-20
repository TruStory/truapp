import React from 'react';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize } from 'shared/styles/views';
import { CommunityCoin } from 'shared/types/appAccount';
import CommunityHoverCoinItem from './CommunityHoverCoinItem';

interface Props {
  communityCoins: CommunityCoin[];
  coinColor: Color;
  coinTextSize: TextSize;
  coinIconSize: IconSize;
  style?: React.CSSProperties;
}

const CommunityHoverCoinList = (props: Props) => {

  const { communityCoins, style, coinColor, coinTextSize, coinIconSize } = props;

  const listJsx: React.ReactNode[] = [];
  communityCoins.map((coin: CommunityCoin) => {
    listJsx.push(
      <CommunityHoverCoinItem
        communityCoin={ coin }
        coinColor={ coinColor }
        coinTextSize={ coinTextSize }
        coinIconSize={ coinIconSize }
        key={ Math.random().toString() }
        style={ { paddingRight: 10 } }
      />,
    );
  });

  return (
    <div style={ { ...styles.container, ...style } }>
      { listJsx }
    </div>
  );
};

CommunityHoverCoinList.defaultProps = {
  coinColor: Color.APP_BLACK,
  coinTextSize: TextSize.H5,
  coinIconSize: IconSize.XXSMALL,
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'flex-start',
    flex: 1,
  },
};

export default CommunityHoverCoinList;
