import React from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import FollowCommunityButton, { FollowButtonType } from 'shared/components/Communities/FollowCommunityButton';
import FOLLOW_COMMUNITIES_QUERY from 'shared/graphql/queries/follow-communities.query';
import FollowCommunitiesQuery, { CommunitiesData } from 'shared/graphql/types/FollowCommunitiesQuery';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Community } from 'shared/types/community';

interface Props {
  account?: Account;
  style?: React.CSSProperties;
}

const CommunitiesDetailedList = (props: Props) => {

  const renderList = (result: QueryResult<CommunitiesData, any>) => {
    const { account, style } = props;

    if (!account)
      return null;

    const { loading, error, data } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.communities) return null;
    const { communities } = data;

    const listJsx: React.ReactNode[] = [];

    communities.map((community: Community) => {
      listJsx.push(
        <div className={ `column is-6-tablet is-6-desktop is-12-mobile` } style={ { ...styles.container, ...style } }>
          <div style={ { padding: Whitespace.TINY } }>
            <div style={ styles.header }>
              <BaseText
                bold={ true }
                color={ community.following ? Color.APP_PURPLE : Color.APP_BLACK }
              >
                { community.name }
              </BaseText>
              <FollowCommunityButton communityId={ community.id } following={ !!community.following } type={ FollowButtonType.ICON } />
            </div>
            <img src={ community.heroImage } style={ styles.image } />
            <BaseText
              style={ { paddingRight: 2, paddingLeft: 2, display: 'flex', marginBottom: Whitespace.MEDIUM } }
            >
              { community.description }
            </BaseText>
          </div>
        </div>,
      );
    });

    return listJsx;
  };

  return (
    <FollowCommunitiesQuery query={ FOLLOW_COMMUNITIES_QUERY }>
      { renderList }
    </FollowCommunitiesQuery>
  );

};

const styles = {
  container: { },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 2,
    paddingLeft: 2,
    marginBottom: Whitespace.TINY,
  },
  image: {
    width: '100%',
    borderRadius: Whitespace.TINY,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(CommunitiesDetailedList);
