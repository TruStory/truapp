import React from 'react';
import CommunityCoinItem from 'shared/components/Communities/CommunityCoinItem';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { CommunityCoin } from 'shared/types/appAccount';

interface Props {
  communityCoins: CommunityCoin[];
  titleColor: Color;
  titleSize: TextSize;
  coinColor: Color;
  coinSize: TextSize;
  style?: React.CSSProperties;
}

const CommunityCoinList = (props: Props) => {

  const { communityCoins, style, titleColor, titleSize, coinColor, coinSize } = props;

  const listJsx: React.ReactNode[] = [];
  communityCoins.map((coin: CommunityCoin) => {
    listJsx.push(
      <div style={ { marginRight: Whitespace.LARGE + 4 } } key={ Math.random().toString() }>
        <CommunityCoinItem
          communityCoin={ coin }
          titleColor={ titleColor }
          titleSize={ titleSize }
          coinColor={ coinColor }
          coinSize={ coinSize }
        />
      </div>,
    );
  });

  return (
    <div style={ { ...styles.container, ...style } }>
      { listJsx }
    </div>
  );
};

CommunityCoinList.defaultProps = {
  titleColor: Color.GRAY,
  titleSize: TextSize.H6,
  coinColor: Color.APP_BLACK,
  coinSize: TextSize.H4,
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    flex: 1,
  },
};

export default CommunityCoinList;
