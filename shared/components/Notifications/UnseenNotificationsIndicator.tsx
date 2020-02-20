import React from 'react';
import { QueryResult, withApollo, WithApolloClient } from 'react-apollo';
import { Platform, PushNotificationIOS, StyleProp, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import BaseIconView from 'shared/components/Base/BaseIconView';
import NOTIFICATIONS_QUERY from 'shared/graphql/queries/notifications.query';
import UNSEEN_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unseen-notifications-count.query';
import UnseenNotificationsCountQuery, { UnseenNotificationsCountData } from 'shared/graphql/types/UnseenNotificationsCountQuery';
import { Color } from 'shared/styles/colors';
import { TextSize } from '../../styles';
import { Whitespace } from '../../styles/views';
import BaseText from '../Base/BaseText';

interface Props {
  account?: Account;
  badge?: boolean;
  size: number;
  color?: Color;
  backgroundColor?: Color;
  style?: StyleProp<any> & React.CSSProperties;
}

const UnseenNotificationsIndicator = (props: WithApolloClient<Props>) => {
  const { account, style, badge, color, backgroundColor, size, client } = props;
  const [ counter, setCounter ] = React.useState(0);
  if (!account) return null;

  const renderComponent = (result: QueryResult<UnseenNotificationsCountData, any>) => {
    const { loading, error, data } = result;

    if (
      loading ||
      error ||
      !data ||
      !data.unseenNotificationsCount) return null;

    if (!data.unseenNotificationsCount.count || data.unseenNotificationsCount.count === 0) {
      if (Platform.OS === 'ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(0);

      setCounter(0);
      return null;
    } else {
      if (Platform.OS === 'ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(data.unseenNotificationsCount.count);

      if (counter !== data.unseenNotificationsCount.count) {
        const r = client.query({
          query: NOTIFICATIONS_QUERY,
          variables: { first: 10 },
          fetchPolicy: 'network-only',
        });
        console.log(r);
      }
      setCounter(data.unseenNotificationsCount.count);
    }

    if (badge) {
      return (
        <View style={ [ styles.countContainer, style, {  backgroundColor } ] }>
          <BaseText color={ color } textSize={ TextSize.H6 } >{ data.unseenNotificationsCount.count }</BaseText>
        </View>
      );
    }

    return (
      <View style={ [ styles.container, style ] }>
        <BaseIconView
          family={ 'Material' }
          color={ Color.RED }
          size={ size }
          name={ 'fiber-manual-record' }
        />
      </View>
    );

  };

  return (
    <UnseenNotificationsCountQuery query={ UNSEEN_NOTIFICATIONS_COUNT_QUERY } pollInterval={ 5000 } fetchPolicy={ 'network-only' }>
      { renderComponent }
    </UnseenNotificationsCountQuery>
  );
};

UnseenNotificationsIndicator.defaultProps = {
  color: Color.APP_PURPLE,
  size: 15,
};

const styles = StyleSheet.create({
  container: {  },
  countContainer: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: Whitespace.SMALL + Whitespace.LARGE,
  },
});

const mapStateToProps = (state: any) => {
  return {
    account: state.auth.account,
  };
};

export default connect(mapStateToProps)(withApollo(UnseenNotificationsIndicator));
