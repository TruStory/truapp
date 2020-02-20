import { NetworkStatus } from 'apollo-boost';
import FeedClaimList from 'mobile/src/components/Claim/FeedClaimList';
import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import React from 'react';
import { QueryResult } from 'react-apollo';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { withCollapsible } from 'react-navigation-collapsible';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import FEED_CLAIMS_QUERY from 'shared/graphql/queries/feed-claims.query';
import FeedClaimsQuery, { FeedClaimsQueryData } from 'shared/graphql/types/FeedClaimsQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { ReactCollapsibleProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';
import { FeedFilters } from 'shared/types/community';

interface NavigationParams {
  communityId: string;
  onSearch: (searchText: string) => void;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  collapsible: ReactCollapsibleProps;
}

const SearchScreen = (props: Props) => {

  const { collapsible, navigation } = props;
  const communityId = navigation.getParam('communityId', 'all');
  const feedFilter = FeedFilters.TRENDING;
  const [ searchText, setSearchText ] = React.useState('');
  let refreshing = false;

  const onSearch = (sText: string) => setSearchText(sText);

  React.useEffect(() => {
    navigation.setParams({ onSearch });
  }, []);

  const renderScreen = (result: QueryResult<FeedClaimsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;
    if (loading && (!data || !data.claims) || networkStatus === NetworkStatus.setVariables ) return <BaseLoadingIndicator />;

    refreshing = networkStatus === NetworkStatus.refetch;

    if (error || !data || data.claims.totalCount === 0) {
      return (
        <View style={ { paddingTop: 50, flex: 1, paddingLeft: Whitespace.SMALL, paddingRight: Whitespace.SMALL } }>
          <ErrorComponent onRefresh={ refetch } text={ 'No claims found with that keyword.' } />
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

    return (
      <React.Fragment>
        <FeedClaimList
          header={ <BaseText bold={ true } textSize={ TextSize.H2 } style={ { marginLeft: Whitespace.SMALL, marginBottom: Whitespace.LARGE } }>Claims</BaseText> }
          claims={ data.claims.edges.map((edge) => edge.node) }
          homeTabClickCount={ 1 }
          refetch={ refetch }
          refreshing={ refreshing }
          onLoadMore={ onFetchMore }
          collapsible={ collapsible }
        />
      </React.Fragment>
    );

  };

  const queryVariables = {
    communityId,
    first: 10,
    feedFilter,
    filterText: searchText,
    isSearch: true,
  };

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <KeyboardAvoidingView
        style={ styles.container }
        behavior={ 'padding' }
        enabled={ Platform.OS === 'ios' }
        keyboardVerticalOffset={ calculateKeyboardOffset() }
      >
        <FeedClaimsQuery
          query={ FEED_CLAIMS_QUERY }
          variables={ queryVariables }
          notifyOnNetworkStatusChange={ true }
        >
          { renderScreen }
        </FeedClaimsQuery>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

};

SearchScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams>}) => {

  let jsx: any = {
    ...headerStyles,
    title: '',
  };

  return jsx;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Whitespace.MEDIUM,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    padding: 0,
  },
  searchContainer: {
    backgroundColor: Color.WHITE,
    flex: 1,
    borderRadius: Whitespace.SMALL,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Color.LINE_GRAY,
  },
});

const SearchBar = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams> }) => {

  const [ searchText, setSearchText ] = React.useState('');
  const onSearch = navigation.getParam('onSearch');
  const onChange = (text: string) => setSearchText(text);
  const onSearchAction = () => {
    Keyboard.dismiss();
    onSearch(searchText);
  };

  return (
    <View style={ styles.searchContainer }>
      <TextInput
        style={ { paddingRight: Whitespace.LARGE, paddingLeft: Whitespace.SMALL, flex: 1 } }
        placeholder='Search'
        value={ searchText }
        onChangeText={ onChange }
        onSubmitEditing={ onSearchAction }
        returnKeyType={ 'search' }
      />
      <BaseActionable onAction={ onSearchAction } style={ { marginRight: Whitespace.SMALL } }>
        <BaseIconView name={ 'search' } />
      </BaseActionable>
    </View>
  );
};

const collapsibleParams = {
  iOSCollapsedColor: Color.WHITE,
  collapsibleComponent: SearchBar,
  collapsibleBackgroundStyle: {
    height: 50,
    // disableFadeoutInnerComponent: true,
  },
};

export default withCollapsible(SearchScreen, collapsibleParams);
