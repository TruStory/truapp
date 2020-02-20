import CloseButton from 'mobile/src/components/Buttons/CloseButton';
import ClaimMenu from 'mobile/src/components/Claim/ClaimMenu';
import FloatingSheet from 'mobile/src/components/FloatingSheet';
import QuestionsComponent from 'mobile/src/components/Questions/QuestionsComponent';
import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { Dimensions, RefreshControl, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import ArgumentList from 'shared/components/Argument/ArgumentList';
import SortOptions from 'shared/components/Argument/SortOptions';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ClaimItem from 'shared/components/Claim/ClaimItem';
import ErrorComponent from 'shared/components/ErrorComponent';
import CLAIM_QUERY from 'shared/graphql/queries/claim.query';
import ClaimQuery, { ClaimQueryData } from 'shared/graphql/types/ClaimQuery';
import { down_purple } from 'shared/images/ArgumentActions/ArgumentActionsImages';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding, scrollViewBottomPadding } from 'shared/styles/utils';
import { IconSize, Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { ArgumentSorts } from 'shared/types/argument';
import { Claim } from 'shared/types/claim';
import { Settings } from 'shared/types/settings';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';
import { argumentSortNameMatchMap } from 'shared/utils/arguments';
import { isLiveVideo, isVideo } from 'shared/utils/video';

interface NavigationParams {
  claimId: ID;
  argumentId?: ID;
  settings: Settings;
  setMenuModalVisible: any;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  settings: Settings;
}

const ClaimScreen = (props: Props) => {
  const { navigation, settings } = props;
  const claimId = +navigation.getParam('claimId');
  const argumentId = +navigation.getParam('argumentId', 0);

  let refreshing: boolean = false;

  const [ modalVisible, setModalVisible ] = React.useState(false);
  const [ argumentSort, setArgumentSort ] = React.useState(ArgumentSorts.TRENDING);

  React.useEffect(() => {
    if (argumentId !== 0) {
      navigation.navigate({
        routeName: Routes.Argument,
        params: { argumentId },
        key: `${Routes.Argument}-${argumentId}`,
      });
    }

    navigation.setParams({ settings });
  }, []);
  let claimAnalytics : Claim | null = null;
  const [firstRender, setFirstRender] = React.useState(false);
  React.useEffect(() => {
    if (firstRender && claimAnalytics ) {
      Analytics.trackInternal('claim_opened', { claimId });
      Analytics.track(AnalyticsEventsMobile.ClaimOpened, { claimId, community: claimAnalytics.community.id });
    }
  }, [firstRender]);

  const onChat = () => {
    if (claimAnalytics) {
      Analytics.track(AnalyticsEventsMobile.ChatOpened, { claimId, community: claimAnalytics.community.id });
    }
    navigation.navigate(Routes.Comment, { claimId, settings });
  };
  const onWriteArgument = () => navigation.navigate(Routes.AddArgumentStack, { claimId, settings });

  const renderScreen = (result: QueryResult<ClaimQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) {
      refreshing = true;
      return <BaseLoadingIndicator />;
    } else { refreshing = false; }
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    const { claim } = data;
    claimAnalytics = claim;
    setFirstRender(true);
    const width = Dimensions.get('screen').width / 2 - Whitespace.SMALL ;

    const chatJsx = (
      <BaseActionable onAction={ onChat } style={ { flexDirection: 'row', width, justifyContent: 'center' } }>
        <BaseIconView name={ 'message-circle' } family={ IconFamily.FEATHER } style={ { marginRight: 4 } } color={ Color.WHITE } />
        <BaseText color={ Color.WHITE }>
          Chat ({ claim.commentCount })
        </BaseText>
      </BaseActionable>
    );

    const onChangeSort = (sort: ArgumentSorts) => {
      setModalVisible(false);
      setArgumentSort(sort);
    };

    if (isLiveVideo(claim)) {
      return (
        <React.Fragment>
          <ScrollView
            refreshControl={ <RefreshControl tintColor={ Color.WHITE } refreshing={ refreshing } onRefresh={ () => navigation.dismiss()  } /> }
          >
            <ClaimItem claim={ claim } />
            <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.TINY } } />
            <QuestionsComponent claimId={ claim.id } style={ { paddingBottom: scrollViewBottomPadding } } />
          </ScrollView>
          <FloatingSheet style={ { paddingHorizontal: Whitespace.SMALL, flexDirection: 'row', justifyContent: 'space-between' } }>
            { chatJsx }
            <BaseButton
              title={ 'Ask Question' }
              outline={ false }
              color={ Color.WHITE }
              accentColor={ Color.APP_PURPLE }
              onAction={ () => { navigation.navigate(Routes.AddQuestionStack, { claimId: claim.id }); } }
              width={ width }
              style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } }
              textSize={ TextSize.H5 }
            />
          </FloatingSheet>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <ScrollView
          refreshControl={ <RefreshControl tintColor={ Color.WHITE } refreshing={ refreshing } onRefresh={ () => navigation.dismiss() } /> }
        >
          <ClaimItem claim={ claim } style={ { paddingTop: isVideo(claim) ? 0 : Whitespace.MEDIUM } } />
          <View style={ { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginHorizontal: Whitespace.SMALL } }>
            <BaseText
              bold={ true }
              textSize={ TextSize.H2 }
              style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.SMALL } }
            >
              Arguments
            </BaseText>
            <BaseActionable style={ { flexDirection: 'row', alignItems: 'center' } } onAction={ () => { setModalVisible(true); } }>
              <BaseText color={ Color.APP_PURPLE }>
                by <BaseText color={ Color.APP_PURPLE } bold={ true }>{ argumentSortNameMatchMap.get(argumentSort) }</BaseText>
              </BaseText>
              <BaseIconImageView size={ IconSize.XSMALL } style={ { paddingLeft: Whitespace.TINY } } source={ down_purple } />
            </BaseActionable>
          </View>
          <ArgumentList
            style= { { paddingBottom: scrollViewBottomPadding, paddingHorizontal: Whitespace.SMALL } }
            claimId={ claim.id }
            sort={ argumentSort }
          />
        </ScrollView>
        <FloatingSheet
          style={ { paddingHorizontal: Whitespace.SMALL, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: actionSheetBottomPadding } }
        >
          { chatJsx }
          <BaseButton
            title={ 'Write Argument' }
            outline={ false }
            color={ Color.WHITE }
            textAlign={ TextAlign.CENTER }
            accentColor={ Color.APP_PURPLE }
            onAction={ onWriteArgument }
            width={ width }
            textSize={ TextSize.H5 }
            style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } }
          />
        </FloatingSheet>
        <ActionSheet
          visible={ modalVisible }
          onCancel={ () => setModalVisible(false) }
        >
          <View style={ { backgroundColor: Color.WHITE, padding: Whitespace.LARGE, paddingBottom: Whitespace.LARGE * 3, paddingTop: 0 } }>
            <BaseText bold={ true } textSize={ TextSize.H2 } style={ { paddingTop: Whitespace.LARGE } }>Sort</BaseText>
            <SortOptions
              value={ argumentSort }
              onChange={ onChangeSort }
            />
          </View>
        </ActionSheet>
      </React.Fragment>
    );
  };

  return (
    <ClaimQuery query={ CLAIM_QUERY } variables={ { claimId } } fetchPolicy={ 'network-only' }>
      { renderScreen }
    </ClaimQuery>
  );
};

ClaimScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const claimId = navigation.getParam('claimId');
  // let fade = new Animated.Value(1);
  // Animated.timing(fade, { toValue: 0, duration: 1000 }).start();

  return {
    ...headerStyles,
    title: '',
    // headerTitle: fade ? (<Animated.View style={ { opacity: fade } }><BaseText>Pull down to close</BaseText></Animated.View>) : null,
    headerRight: (
      <ClaimMenu claimId={ claimId } style={ { marginRight: Whitespace.SMALL } } />
      ),
    headerLeft: <CloseButton />,
  };
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(ClaimScreen)
;
