import React, { CSSProperties } from 'react';
import { QueryResult } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import COMMUNITIES_QUERY from 'shared/graphql/queries/communities.query';
import CommunitiesQuery, { CommunitiesQueryData } from 'shared/graphql/types/CommunitiesQuery';
import { Community } from 'shared/types/community';
import { Routes } from '../../navigation/Routes';
import MenuLink from '../Menu/MenuLink';

interface Props extends RouteComponentProps {
  onSidebarItemClick: () => void;
  style?: CSSProperties;
}

const CommunitiesSidebar = (props: Props) => {

  const { history, style, onSidebarItemClick } = props;
  const renderCommunities = (result: QueryResult<CommunitiesQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.communities) return <ErrorComponent onRefresh={ refetch } />;
    const communities: Community[] = data.communities;

    const listJsx: React.ReactNode[] = [];
    communities.map((community: Community) => {

      const goToPath = () => {
        onSidebarItemClick();
        history.push({
          pathname: `${Routes.COMMUNITY}${community.id}`,
          state: { communityId: community.id },
        });
      };

      listJsx.push(
        <MenuLink
          key={ community.id }
          path={ `${Routes.COMMUNITY}${community.id}` }
          title={ community.name }
          onClick={ goToPath }
          icon={ { active: community.iconImage.active, regular: community.iconImage.regular } }
        />,
        );
    });

    return (
      <div style={ { ...styles.container, ...style } }>
        { listJsx }
      </div>
    );
  };

  return (
    <CommunitiesQuery query={ COMMUNITIES_QUERY }>
      { renderCommunities }
    </CommunitiesQuery>
  );
};

const styles = {
  container: {  },
};

export default withRouter(CommunitiesSidebar);
