import gql from 'graphql-tag';

const UNSEEN_NOTIFICATIONS_COUNT_QUERY = gql`
  query UnseenNotificationsCountQuery {
    unseenNotificationsCount {
      count
    }
  }
`;

export default UNSEEN_NOTIFICATIONS_COUNT_QUERY;
