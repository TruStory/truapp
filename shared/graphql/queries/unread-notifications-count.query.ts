import gql from 'graphql-tag';

const UNREAD_NOTIFICATIONS_COUNT_QUERY = gql`
  query UnreadNotificationsCountQuery {
    unreadNotificationsCount {
      count
    }
  }
`;

export default UNREAD_NOTIFICATIONS_COUNT_QUERY;
