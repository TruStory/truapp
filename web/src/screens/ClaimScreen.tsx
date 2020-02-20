import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { match, RouteComponentProps, withRouter } from 'react-router';
import ArgumentList from 'shared/components/Argument/ArgumentList';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ClaimItem from 'shared/components/Claim/ClaimItem';
import ErrorComponent from 'shared/components/ErrorComponent';
import CLAIM_QUERY from 'shared/graphql/queries/claim.query';
import ClaimQuery, { ClaimQueryData } from 'shared/graphql/types/ClaimQuery';
import { TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import { ArgumentSorts } from 'shared/types/argument';
import { Claim } from 'shared/types/claim';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import { isHostedVideo, isLiveVideo } from 'shared/utils/video';
import ArgumentSortDropdown from 'web/src/components/Filters/ArgumentSortDropdown';
import AddArgumentComponent from '../components/Argument/AddArgumentComponent';
import BaseText from '../components/Base/BaseText';
import LiveVideoClaimItem from '../components/Claim/LiveVideoClaimItem';
import VideoClaimItem from '../components/Claim/VideoClaimItem';
import CommentsComponent from '../components/Comments/CommentsComponent';
import { generateDocumentTitle } from '../utils';

interface Params {
  claimId?: string;
  selectedArgumentId?: string;
  selectedCommentId?: string;
}
interface Props extends RouteComponentProps {
  match: match<Params>;
}

const ClaimScreen = (props: Props) => {
  const { match } = props;
  const claimId = match.params.claimId ? parseInt(match.params.claimId) : -1;

  const [ selectedArgumentId, setSelectedArgumentId ] =
    React.useState(match.params.selectedArgumentId ? parseInt(match.params.selectedArgumentId) : -1);
  const selectedCommentId = match.params.selectedCommentId ? parseInt(match.params.selectedCommentId) : undefined;
  let claimAnalytics : Claim | null = null;
  const [firstRender, setFirstRender] = React.useState(false);
  const [argumentSort, setArgumentSort] = React.useState(ArgumentSorts.TRENDING);
  React.useEffect(() => {
    if (firstRender && claimAnalytics ) {
      Analytics.track(AnalyticsEventsWeb.ClaimOpened, { claimId, community: claimAnalytics.community.id });
    }
  }, [firstRender]);

  const onChangeArgumentSort = (sort: ArgumentSorts) => {
    setArgumentSort(sort);
  };

  const renderScreen = (result: QueryResult<ClaimQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const { claim } = data;
    claimAnalytics = claim;
    generateDocumentTitle(claim.body);

    const onArgumentAdded = (addedArgumentId: string) => {
      setSelectedArgumentId(parseInt(addedArgumentId));
    };
    setFirstRender(true);

    const sortArgumentsJsx = (
      <div style={ { display: 'flex', justifyContent: 'space-between', paddingBottom: Whitespace.SMALL } }>
        <BaseText
          bold={ true }
          textSize={ TextSize.H2 }
          style={ { marginLeft: Whitespace.CONTAINER } }
        >
          Arguments
        </BaseText>
        <ArgumentSortDropdown
          value={ argumentSort }
          onChange={ onChangeArgumentSort }
        />
      </div>
    );

    if (isLiveVideo(claim)) {
      return (
        <div style={ { ...styles.container } }>
          <LiveVideoClaimItem
            claim={ claim }
            selectedCommentId={ selectedCommentId }
          />
        </div>
      );
    }

    if (isHostedVideo(claim)) {
      return (
        <div style={ { ...styles.container } }>
          <VideoClaimItem claim={ claim } />
          <AddArgumentComponent
            claimId={ claim.id }
            community={ claim.community.id }
            style={ { marginTop: Whitespace.SMALL } }
            onArgumentAdded={ onArgumentAdded }
          />
          <BaseLine style={ { marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } } />
          { claim.argumentCount === 0 ? null : sortArgumentsJsx }
          <ArgumentList
            sort={ argumentSort }
            claimId={ claim.id }
            selectedArgumentId={ selectedArgumentId }
          />
          <CommentsComponent
            claimId={ claim.id }
            community={ claim.community.id }
            selectedCommentId={ selectedCommentId }
            initiallyOpen={ false }
          />
        </div>
      );
    }

    return (
      <div style={ { ...styles.container } }>
        <ClaimItem claim={ claim } />
        <AddArgumentComponent
          claimId={ claim.id }
          community={ claim.community.id }
          style={ { marginTop: Whitespace.LARGE } }
          onArgumentAdded={ onArgumentAdded }
        />
        <BaseLine style={ { marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } } />
        { claim.argumentCount === 0 ? null : sortArgumentsJsx }
        <ArgumentList
          sort={ argumentSort }
          claimId={ claim.id }
          selectedArgumentId={ selectedArgumentId }
        />
        <CommentsComponent
          claimId={ claim.id }
          community={ claim.community.id }
          selectedCommentId={ selectedCommentId }
          initiallyOpen={ true }
          // initiallyOpen={ selectedArgumentId === -1 && selectedCommentId !== undefined }
        />
      </div>
    );
  };

  return (
    <ClaimQuery query={ CLAIM_QUERY } variables={ { claimId } }>
      { renderScreen }
    </ClaimQuery>
  );
};

const styles = {
  container: { },
};

export default withRouter(ClaimScreen);
