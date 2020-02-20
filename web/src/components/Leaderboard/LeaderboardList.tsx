import React from 'react';
import { connect } from 'react-redux';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import AppAccountLink from 'shared/components/AppAccount/AppAccountLink';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BaseActionable from 'shared/components/Base/BaseActionable';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { LeaderboardMetricFilters, TopUser } from 'shared/types/leaderboard';
import { Settings } from 'shared/types/settings';
import { leaderboardMetricFilterReverseMatchMap } from 'shared/utils/leaderboard';
import BaseATag from 'web/src/components/Base/BaseATag';
import BaseText from '../Base/BaseText';

interface HeaderItem {
  name: string;
  filter : LeaderboardMetricFilters;
}
const headers : Array<HeaderItem> = [
  {
    name: leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.TRU_EARNED)!,
    filter: LeaderboardMetricFilters.TRU_EARNED,
  },
  {
    name: leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.AGREES_RECEIVED)!,
    filter: LeaderboardMetricFilters.AGREES_RECEIVED,
  },
  {
    name: leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.AGREES_GIVEN)!,
    filter: LeaderboardMetricFilters.AGREES_GIVEN,
  },
];

// tslint:disable: jsx-no-multiline-js jsx-no-lambda
const renderFilteredHeaders = (sortedBy: LeaderboardMetricFilters, onSelected: (filter: LeaderboardMetricFilters ) => void ) => {
  return (
    headers.map((header) => {
      const isSelected =  sortedBy === header.filter;
      const headerStyle = { ...(isSelected && { textDecoration: 'underline' }) };
      return (
        <th key={ header.name } >
          <div className='header'>
            <BaseActionable onAction={ () => { onSelected(header.filter); } } >
               <BaseATag textSize={ TextSize.H4 } bold ={ isSelected } color={ Color.APP_PURPLE } style={ headerStyle } >
                    { header.name }
                </BaseATag>
            </BaseActionable>
          </div>
        </th>
      );
    })
  );
};

interface LeaderboardListProps {
  onMetricFilterSelected : (filter: LeaderboardMetricFilters) => void;
  settings: Settings;
  sortedBy : LeaderboardMetricFilters;
  topUsers : TopUser[];
}

const parseAmount = (value : string ) : string =>  {
  let s =  value.split('.');
  if (s.length !== 2 || s[1].length === 0) {
    return value;
  }
  return `${s[0]}.${s[1].substring(0, 1)}`;
};

const getUsername = (value : string ) : string =>  {
  const trucateSize = isLargerThanTablet() ? 15 : 12;
  if (value.length <= trucateSize) {
    return value;
  }
  return value.substr(0, 9)  + '...';
};
const LeaderboardList = (props : LeaderboardListProps) => {
  const { sortedBy, topUsers , settings , onMetricFilterSelected } = props;

  const renderAvatar= (user: TopUser) => (
    <div style={ { display: 'flex' } }>
      <AppAccountAvatar appAccount={ user.account } avatarSize={ AvatarSize.LARGE } avatarStyle={ { marginRight: '16px' } } />
      <AppAccountLink appAccount={ user.account } style={ { marginBottom: Whitespace.LARGE } }>
          <BaseText textSize={ TextSize.H4 }>{ getUsername(user.account.userProfile.username) } </BaseText>
      </AppAccountLink>
    </div>
  );

  const renderTopUsersFixedColumns =  topUsers.map((user, i) => {
    return (
      <tr key={ `top-user-fixed-${user.address}`  }  style={ { height: '58px' } }>
        <td>
          <div style={ { display: 'flex', alignItems: 'center', justifyContent: 'center' } } >
            <BaseText textSize={ TextSize.H4 } bold={ true } >{ i + 1 }</BaseText>
          </div>
        </td>
      </tr>
    );
  });
  const rowStyles = { display: 'flex', justifyContent: 'center' , alignItems: 'center' };
  const renderTopUserMetrics = topUsers.map((user, i) => {
    return (
      <tr key={ `top-user-metric${user.address}`  } style={ { height: '58px' } }>
        <td> { renderAvatar(user) }</td>
        <td>
          <div style={ rowStyles }>
            <BaseText textSize={ TextSize.H4 }> { parseAmount(user.earned.humanReadable) } { settings.stakeDisplayDenom } </BaseText>
          </div>
        </td>
        <td>
          <div style={ rowStyles }>
            <BaseText textSize={ TextSize.H4 }>{ user.agreesReceived } </BaseText>
          </div>
        </td>
        <td>
          <div style={ rowStyles }>
            <BaseText textSize={ TextSize.H4 }>{ user.agreesGiven }</BaseText>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div style={ { ...styles.container } } >
      <div className={ 'metrics-container' }>
        <table className={ 'fixed-table' }>
            <thead>
              <tr>
                <th>
                  <div style={ { width:   '50px', justifyContent: 'center' } } className={ 'header' }>
                    <BaseText textSize={ TextSize.H4 } color={ Color.APP_PURPLE }>
                        Rank
                    </BaseText>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              { renderTopUsersFixedColumns }
            </tbody>
        </table>
        <div className={ 'metrics-table-container' }>
          <table className={ 'metrics-table' }>
              <thead>
                <tr>
                  <th>
                    <div className={ 'header name' } >
                      <BaseText textSize={ TextSize.H4 } color={ Color.APP_PURPLE }>
                          Name
                      </BaseText>
                    </div>
                  </th>
                  { renderFilteredHeaders(sortedBy, onMetricFilterSelected) }
                </tr>
              </thead>
              <tbody>
                { renderTopUserMetrics }
              </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

const styles = {
  container : {
    padding: Whitespace.LARGE,
    paddingRight: Whitespace.TINY,
    borderRadius: 'inherit',
  },
};

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(LeaderboardList);
