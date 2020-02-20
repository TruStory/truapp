import { NetworkStatus } from 'apollo-boost';
import FeedClaimList from 'mobile/src/components/Claim/FeedClaimList';
import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import React from 'react';
import { QueryResult } from 'react-apollo';
import { SafeAreaView, View } from 'react-native';
import { DrawerActions, NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { withCollapsible } from 'react-navigation-collapsible';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ClaimOfTheDay from 'shared/components/Claim/ClaimOfTheDay';
import FilterOptions from 'shared/components/Claim/FilterOptions';
import ErrorComponent from 'shared/components/ErrorComponent';
import FEED_CLAIMS_QUERY from 'shared/graphql/queries/feed-claims.query';
import FeedClaimsQuery, { FeedClaimsQueryData } from 'shared/graphql/types/FeedClaimsQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { ReactCollapsibleProps } from 'shared/styles/props';
import { IconSize, Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { FeedFilters } from 'shared/types/community';
import { feedFilterNameMatchMap } from 'shared/utils/communities';

interface NavigationParams {
  communityId: string;
  setModalVisible: any;
  homeTabClickCount: number;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  collapsible: ReactCollapsibleProps;
  account?: Account;
}

const FeedScreen = (props: Props) => {

  const { collapsible, navigation, account } = props;
  const communityId = navigation.getParam('communityId', 'all');
  const homeTabClickCount = navigation.getParam('homeTabClickCount');
  const [ feedFilter, setFeedFilter ] = React.useState(FeedFilters.TRENDING);
  const [ modalVisible, setModalVisible ] = React.useState(false);
  const [ cacheBuster, setCacheBuster ] = React.useState(Math.random());
  const onOpenClaim = (claimId: ID) => navigation.navigate(Routes.Claim, { claimId });
  let refreshing = false;

  React.useEffect(() => {
    navigation.setParams({ setModalVisible });
    if (account && !account.userMeta.onboardFollowCommunities) {
      navigation.navigate(Routes.OnboardingStack, { onboardingStep: true });
    }
  }, []);

  const claimOfTheDayJsx = (
    <React.Fragment>
      <ClaimOfTheDay
        cacheBuster={ cacheBuster }
        communityId={ communityId }
        style={ { marginBottom: Whitespace.LARGE, marginTop: Whitespace.SMALL } }
        onOpenClaim={ onOpenClaim }
      />
      <BaseText
        bold={ true }
        textSize={ TextSize.H2 }
        style={ { paddingLeft: Whitespace.SMALL, marginBottom: Whitespace.MEDIUM } }
      >
        { feedFilterNameMatchMap.get(feedFilter!) }
      </BaseText>
    </React.Fragment>
  );

  if (!account) {
    navigation.navigate(Routes.Auth);
  }

  const renderScreen = (result: QueryResult<FeedClaimsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;
    if (loading && (!data || !data.claims) || networkStatus === NetworkStatus.setVariables ) return <BaseLoadingIndicator />;

    refreshing = networkStatus === NetworkStatus.refetch;

    if (error || !data || data.claims.totalCount === 0) {
      return (
        <View style={ { paddingTop: 50, flex: 1, paddingLeft: Whitespace.SMALL, paddingRight: Whitespace.SMALL } }>
          { claimOfTheDayJsx }
          <ErrorComponent onRefresh={ refetch } />
        </View>
      );
    }

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready || data.claims.pageInfo.hasNextPage === false) return;
      fetchMore({
        variables: { after: data.claims.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.claims) { return prev; }
          if (fetchMoreResult.claims.pageInfo.endCursor === prev.claims.pageInfo.endCursor) return prev;
          fetchMoreResult.claims.edges = prev.claims.edges.concat(fetchMoreResult.claims.edges);
          return fetchMoreResult;
        },
      });
    };

    const onChangeFilter = (filter: FeedFilters) => {
      setModalVisible(false);
      setFeedFilter(filter);
      onRefreshAll();
    };

    const onRefreshAll = () => {
      refetch();
      setCacheBuster(Math.random());
    };

    return (
      <React.Fragment>
        <FeedClaimList
          claims={ data.claims.edges.map((edge) => edge.node) }
          refetch={ onRefreshAll }
          refreshing={ refreshing }
          header={ claimOfTheDayJsx }
          onLoadMore={ onFetchMore }
          collapsible={ collapsible }
          homeTabClickCount={ homeTabClickCount }
        />
        <ActionSheet
          visible={ modalVisible }
          onCancel={ () => setModalVisible(false) }
        >
          <View style={ { backgroundColor: Color.WHITE, padding: Whitespace.LARGE, paddingBottom: Whitespace.LARGE * 3, paddingTop: 0 } }>
            <BaseText bold={ true } textSize={ TextSize.H2 } style={ { paddingTop: Whitespace.LARGE } }>Filters</BaseText>
            <FilterOptions
              value={ feedFilter }
              onChange={ onChangeFilter  }
            />
          </View>
        </ActionSheet>
      </React.Fragment>
    );

  };

  const queryVariables = {
    communityId,
    first: 10,
    feedFilter,
  };

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <FeedClaimsQuery
        query={ FEED_CLAIMS_QUERY }
        variables={ queryVariables }
        notifyOnNetworkStatusChange={ true }
      >
        { renderScreen }
      </FeedClaimsQuery>
    </SafeAreaView>
  );

};

FeedScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams>}) => {
  const onAction = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const communityId = navigation.getParam('communityId', 'Home');
  const onPressFilter = () => {
    const setModalVisible = navigation.getParam('setModalVisible');
    setModalVisible(true);
  };

  let jsx: any = {
    ...headerStyles,
    title: '',
  };

  const filterJsx = (
    <BaseActionable onAction={ onPressFilter }>
      <BaseIconView name='filter' color={ Color.APP_BLACK } size={ IconSize.XSMALL } style={ { marginRight: Whitespace.SMALL } } />
    </BaseActionable>
  );

  if (communityId === 'Home') {
    jsx.headerLeft = (
      <BaseActionable onAction={ onAction }>
        <BaseIconView name='menu' color={ Color.APP_BLACK } size={ IconSize.REGULAR } style={ { marginLeft: Whitespace.CONTAINER } } />
      </BaseActionable>
    );
    jsx.headerRight = (
      <React.Fragment>
        { filterJsx }
        <BaseActionable onAction={ () => navigation.navigate(Routes.Search) }>
          <BaseIconView name='search' color={ Color.APP_BLACK } size={ IconSize.XSMALL } style={ { marginRight: Whitespace.SMALL } } />
        </BaseActionable>
      </React.Fragment>
    );
  } else {
    jsx.headerRight = filterJsx;
  }

  return jsx;
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withCollapsible(connect(mapStateToProps)(FeedScreen), { iOSCollapsedColor:  Color.WHITE });
