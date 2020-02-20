import AnimatedFlatList from 'mobile/src/components/AnimatedFlatList';
import { Routes } from 'mobile/src/navigation/Routes';
import React from 'react';
import { Dimensions, Image, ListRenderItemInfo, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import TopArgumentHeader from 'shared/components/Argument/TopArgumentHeader';
import BaseLine from 'shared/components/Base/BaseLine';
import FeedClaimItem from 'shared/components/Claim/FeedClaimItem';
import { invite_feed_image } from 'shared/images/Invite/InviteImages';
import { PaginatedListProps, ReactCollapsibleProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';
import { FeedClaim } from 'shared/types/claim';

interface Props extends NavigationScreenProps, PaginatedListProps {
  homeTabClickCount: number;
  claims: FeedClaim[];
  header?: JSX.Element;
  collapsible: ReactCollapsibleProps;
  style?: StyleProp<ViewStyle>;
}

const FeedClaimList = (props: Props) => {

  const { navigation, claims, refetch, refreshing, header, onLoadMore, collapsible, homeTabClickCount } = props;
  const keyExtractor = (item: FeedClaim, index: number) => index.toString();
  const listRef = React.useRef<AnimatedFlatList>(null);

  React.useEffect(() => {
    if (listRef.current)
      listRef.current.scrollToOffset(0, true);
  }, [homeTabClickCount]);

  const renderClaim = (rowData: ListRenderItemInfo<FeedClaim>) => {
    const onPressClaim = () => navigation.navigate({
      routeName: Routes.ClaimStack,
      params: { claimId: rowData.item.id },
      key: `${Routes.Claim}-${rowData.item.id}`,
    });

    const renderTopArgument = () => {
      if (!rowData.item.topArgument) return null;

      return (
        <View style={ { marginTop: Whitespace.CONTAINER, flexDirection: 'column' } }>
          <TopArgumentHeader argument={ rowData.item.topArgument } style={ { marginBottom: Whitespace.TINY } } />
          <ArgumentSummaryText summary={ rowData.item.topArgument.summary } />
        </View>
      );
    };

    const claimJsx = (
      <TouchableOpacity onPress={ onPressClaim } delayPressIn={ 1000 } >
        <FeedClaimItem
          claim={ rowData.item }
          style={ { paddingHorizontal: Whitespace.SMALL } }
        >
          { renderTopArgument() }
        </FeedClaimItem>
      { rowData.index !== 2 && <BaseLine style={ { width: Dimensions.get('screen').width - 16, marginLeft: Whitespace.CONTAINER, marginVertical: Whitespace.LARGE } } /> }
      </TouchableOpacity>
    );

    if (rowData.index === 2) {
      return (
        <React.Fragment>
          { claimJsx }
          <TouchableOpacity onPress={ () => navigation.navigate(Routes.Invite) } style={ { marginVertical: Whitespace.LARGE, width: '100%' } }>
            <Image source={ invite_feed_image } style={ { width: '100%' } } />
          </TouchableOpacity>
        </React.Fragment>
      );
    }

    return claimJsx;
  };

  return (
    <AnimatedFlatList
      ref={ listRef }
      onRefresh={ refetch }
      refreshing={ refreshing }
      onEndReached={ onLoadMore }
      onEndReachedThreshold={ 0.2 }
      keyExtractor={ keyExtractor }
      ListHeaderComponent={ header }
      data={ claims }
      renderItem={ renderClaim }
      style={ { paddingBottom: Whitespace.TINY } }
      collapsible={ collapsible }
    />
  );

};

export default withNavigation(FeedClaimList);
