import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import OpenProfile from 'shared/components/AppAccount/OpenProfile';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import INVITES_QUERY from 'shared/graphql/queries/invites.query';
import InvitesQuery, { InvitesQueryData } from 'shared/graphql/types/InvitesQuery';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Invite } from 'shared/types/invite';

const HEADERS = ['Date', 'User', 'Friend', 'Friend Email', 'Arguments', 'Earned', 'Paid'];

const InviteRow = (props: Invite) => {
  const { creator, friend, friendEmail, createdAt, paid } = props;

  const friendJsx = () => {
    return (
      <OpenProfile appAccount={ friend }>
        <span style={ { color: Color.PURPLE } }>
          { friend.userProfile.username }
        </span>
      </OpenProfile>
    );
  };

  return (
    <tr>
      <td>{ createdAt }</td>
      <td>
        <OpenProfile appAccount={ creator }>
          <span style={ { color: Color.PURPLE } }>
            { creator.userProfile.username }
          </span>
        </OpenProfile>
      </td>
      <td>{ friend !== null ? friendJsx() : 'No account' }</td>
      <td>{ friendEmail }</td>
      <td>{ friend !== null ? friend.totalArguments : 0 }</td>
      <td>{ friend !== null ? friend.earnedBalance.humanReadable : 0  }</td>
      <td>{ paid.toString() }</td>
      { /* <td>{ accountCreated ? <PayReward address={ creator.id } inviteId={ id } /> : null }</td> */ }
    </tr>
  );
};

const InvitesScreen: React.FunctionComponent<RouteComponentProps> = (props: RouteComponentProps) => {

  const renderList = (result: QueryResult<InvitesQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const { invites } = data;

    const headers = <tr>{ HEADERS.map((header) => <th key={ header }>{ header }</th>) }</tr>;
    const rows = invites.map((props) => <InviteRow { ...props } key={ props.createdAt } />);

    return (
    <div style={ { ...styles.container } }>
      <div className={ 'columns is-centered' }>
        <div className={ 'column is-12-desktop' }>
        <table cellPadding='5'>
          <thead>
            { headers }
          </thead>
          <tbody>
            { rows }
          </tbody>
        </table>

        </div>
      </div>
    </div>
    );
  };

  return (
    <InvitesQuery query={ INVITES_QUERY }>
      { renderList }
    </InvitesQuery>
  );
};

const styles = {
  container: { },
  image: {
    width: '100%',
    marginTop: Whitespace.LARGE,
    marginBottom: Whitespace.MEDIUM,
    marginLeft: '-100%',
    marginRight: 0,
  },
};

export default InvitesScreen;
