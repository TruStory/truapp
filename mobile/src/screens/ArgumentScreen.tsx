import ClaimHeader from 'mobile/src/components/Claim/ClaimHeader';
import FloatingSheet from 'mobile/src/components/FloatingSheet';
import TrustoryMarkdown from 'mobile/src/components/Markdown/TrustoryMarkdown';
import { Routes } from 'mobile/src/navigation/Routes';
import ArgumentEdit from 'mobile/src/screens/ArgumentEdit';
import { headerStyles } from 'mobile/src/styles';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { RefreshControl } from 'react-native';
import { renderRules } from 'react-native-markdown-renderer';
import { NavigationScreenProp, NavigationScreenProps, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import AddArgumentComment from 'shared/components/Argument/AddArgumentComment';
import ArgumentActions from 'shared/components/Argument/ArgumentActions';
import ArgumentHeader from 'shared/components/Argument/ArgumentHeader';
import ArgumentSummaryText from 'shared/components/Argument/ArgumentSummaryText';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import ARGUMENT_QUERY from 'shared/graphql/queries/argument.query';
import ArgumentQuery, { ArgumentQueryData } from 'shared/graphql/types/ArgumentQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily } from 'shared/styles/fonts';
import { isIphoneX, scrollViewBottomPadding } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Argument } from 'shared/types/argument';
import { Settings } from 'shared/types/settings';
import Analytics, { AnalyticsEventsMobile, AnalyticsEventsWeb } from 'shared/utils/analytics';

interface NavigationParams {
  argumentId: ID;
  settings: Settings;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  settings: Settings;
}

const ArgumentScreen = (props: Props) => {
  const { navigation, settings } = props;
  const argumentId = +navigation.getParam('argumentId');
  let refreshing: boolean = false;
  let argumentAnalytics : Argument | null = null;
  const [firstRender, setFirstRender] = React.useState(false);
  React.useEffect(() => {
    if (firstRender && argumentAnalytics ) {
      Analytics.track(AnalyticsEventsWeb.ReadMore,
        { claimId: argumentAnalytics.claimId, argumentId: argumentAnalytics.id , community: argumentAnalytics.communityId });
      Analytics.trackInternal('argument_opened',  { claimId:  argumentAnalytics.claimId , argumentId : argumentAnalytics.id });
    }
  }, [firstRender]);
  React.useEffect(() => {
    navigation.setParams({ settings });
  }, []);

  const addArgumentCommentRenderRules = (claimId: ID, argumentId: ID, community: string) => {
    const rules = { } as { [key: string]: any };
    for (let rule in renderRules) {
      rules[rule] = ((rule: string) => {
        let elementId = 0;
        return (node: any , children: React.ReactNode[], parent: React.ReactNode[], styles: any) => {
          // check if element has parent, if it does not, inject ability to reply to element
          if (parent.length === 0) {
            elementId++;
            const onPress = ((elementId: ID) => () => {
              navigation.navigate(Routes.ArgumentComment, { claimId, argumentId, elementId, settings });
              const props = { claimId, argumentId, community };
              Analytics.track(AnalyticsEventsMobile.AddReplyClicked, props);
            })(elementId);
            return (
              <AddArgumentComment claimId={ claimId } argumentId={ argumentId } elementId={ elementId } onPress={ onPress }>
                { (renderRules[rule])(node, children, parent, styles) }
              </AddArgumentComment>
            );
          }
          return renderRules[rule](node, children, parent, styles);
        };
      })(rule);
    }
    return rules;
  };

  const renderScreen = (result: QueryResult<ArgumentQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) {
      refreshing = true;
      return <BaseLoadingIndicator />;
    } else { refreshing = false; }
    if (error || !data || !data.claimArgument) return <ErrorComponent onRefresh={ refetch } />;
    const { claimArgument } = data;
    argumentAnalytics = claimArgument;
    setFirstRender(true);

    return (
      <React.Fragment>
        <ScrollView
          contentContainerStyle={ { paddingBottom: scrollViewBottomPadding, paddingHorizontal: Whitespace.MEDIUM } }
          showsVerticalScrollIndicator={ false }
          refreshControl={ <RefreshControl refreshing={ refreshing } tintColor={ Color.WHITE } onRefresh={ () => navigation.dismiss() } /> }
        >
          <ClaimHeader
            claimId={ claimArgument.claimId }
            textSize={ TextSize.H4 }
            notification={ true }
            style={ { marginBottom: Whitespace.LARGE } }
          />
          <ArgumentHeader argument={ claimArgument } />
          <BaseText bold={ true } style={ { marginTop: Whitespace.MEDIUM } }>TLDR</BaseText>
          <ArgumentSummaryText
            summary={ claimArgument.summary }
            style={ { marginTop: Whitespace.SMALL } }
            textSize={ TextSize.H4 }
            fontFamily={ FontFamily.serif }
          />
          <BaseText bold={ true } style={ { marginTop: Whitespace.SMALL } }>Argument</BaseText>
          <TrustoryMarkdown rules={ addArgumentCommentRenderRules(claimArgument.claimId, argumentId, claimArgument.communityId) }>
            { claimArgument.body }
          </TrustoryMarkdown>
        </ScrollView>
        <FloatingSheet style={ { padding: Whitespace.MEDIUM, paddingBottom: isIphoneX() ? Whitespace.LARGE * 3 : Whitespace.LARGE } }>
          <ArgumentActions argument={ claimArgument } />
        </FloatingSheet>
      </React.Fragment>
    );
  };

  return (
    <ArgumentQuery query={ ARGUMENT_QUERY } variables={ { argumentId } }>
      { renderScreen }
    </ArgumentQuery>
  );

};

ArgumentScreen.navigationOptions = ({ navigation }: { navigation :  NavigationScreenProp<any,  any>}) => {
  const argumentId = navigation.getParam('argumentId');

  return {
    ...headerStyles,
    title: ' ',
    headerRight: <ArgumentEdit argumentId={ argumentId } />,
  };
};

const mapStateToProps = (state: any) => ({
  account :  state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(ArgumentScreen);
