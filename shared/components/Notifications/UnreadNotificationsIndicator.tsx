import React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import BaseIconView from 'shared/components/Base/BaseIconView';
import UNREAD_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unread-notifications-count.query';
import UnreadNotificationsCountQuery, { UnreadNotificationsCountData } from 'shared/graphql/types/UnreadNotificationsCountQuery';
import { Color } from 'shared/styles/colors';
import { TextSize } from '../../styles';
import { Whitespace } from '../../styles/views';
import BaseText from '../Base/BaseText';

export enum NotificationIndicatorType {
  BADGE,
  TEXT,
  ICON,
}
interface Props {
  account?: Account;
  bold?: boolean;
  type?: NotificationIndicatorType;
  textSize?: TextSize;
  color?: Color;
  backgroundColor?: Color;
  style?: StyleProp<any> & React.CSSProperties;
}

const UnreadNotificationsIndicator = (props: Props) => {
  const { account, style, type, color, backgroundColor, textSize, bold } = props;
  if (!account) return null;

  const renderComponent = (result: QueryResult<UnreadNotificationsCountData, any>) => {
    const { loading, error, data } = result;

    if (
      loading ||
      error ||
      !data ||
      !data.unreadNotificationsCount ||
      !data.unreadNotificationsCount.count ||
      data.unreadNotificationsCount.count === 0) return null;

    if (type === NotificationIndicatorType.BADGE) {
      return (
        <View style={ [ styles.countContainer, style, {  backgroundColor } ] }>
          <BaseText color={ color } textSize={ textSize || TextSize.H6 } bold={ bold } >{ data.unreadNotificationsCount.count }</BaseText>
        </View>
      );
    } else if (type === NotificationIndicatorType.TEXT) {
      return (
        <BaseText
          color={ color }
          textSize={ textSize || TextSize.H6 }
          style={ style }
          bold={ bold }
        >
          ({ data.unreadNotificationsCount.count })
        </BaseText>
      );
    }

    return (
      <View style={ [ styles.container, style ] }>
        <BaseIconView
          family={ 'Material' }
          color={ Color.RED }
          size={ 15 }
          name={ 'fiber-manual-record' }
        />
      </View>
    );

  };

  return (
    <UnreadNotificationsCountQuery query={ UNREAD_NOTIFICATIONS_COUNT_QUERY } pollInterval={ 15000 } fetchPolicy={ 'network-only' }>
      { renderComponent }
    </UnreadNotificationsCountQuery>
  );
};

UnreadNotificationsIndicator.defaultProps = {
  color: Color.APP_PURPLE,
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

export default connect(mapStateToProps)(UnreadNotificationsIndicator);
