import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import OpenProfile from 'shared/components/AppAccount/OpenProfile';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import SLASHES_QUERY from 'shared/graphql/queries/slashes.query';
import SlashesQuery, { SlashesQueryData } from 'shared/graphql/types/SlashesQuery';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { SlashWithArgument } from 'shared/types/slash';
import { slashArgumentReasonMatchMap } from 'shared/utils/slashing';
import { Routes } from '../navigation/Routes';

const HEADERS = ['Date', 'User', 'Argument', 'Reason', 'Detailed Reason'];

const SlashRow = (props: SlashWithArgument) => {
  const { createdTime, creator, argument, reason, detailedReason } = props;

  return (
    <tr>
      <td>{ createdTime.split('T')[0] }</td>
      <td>
        <OpenProfile appAccount={ creator }>
          <span style={ { color: Color.PURPLE } }>
            { creator.userProfile.username }
          </span>
        </OpenProfile>
      </td>
      <td><BaseATag appLink={ `${Routes.CLAIM}${argument.claimId}${Routes.ARGUMENT}${argument.id}` }>{ argument.summary }</BaseATag></td>
      <td>{ slashArgumentReasonMatchMap.get(reason) }</td>
      <td>{ detailedReason }</td>
    </tr>
  );
};

const SlashesScreen: React.FunctionComponent<RouteComponentProps> = (props: RouteComponentProps) => {

  const renderList = (result: QueryResult<SlashesQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const { slashes } = data;

    const headers = <tr>{ HEADERS.map((header) => <th key={ header }>{ header }</th>) }</tr>;
    const rows = slashes.map((props) => <SlashRow { ...props } key={ props.id } />);

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
    <SlashesQuery query={ SLASHES_QUERY }>
      { renderList }
    </SlashesQuery>
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

export default SlashesScreen;
