import gql from 'graphql-tag';
import CREATOR_FRAGMENT from 'shared/graphql/fragments/creator.fragment';
import PAGE_INFO_FRAGMENT from '../fragments/page-info.fragment';

// TODO: put in pagination once we launch new site
// if we put it in now we'll break existing site
const NOTIFICATIONS_QUERY = gql`
  query UserNotificationsQuery($first: Number, $after: String) {
    notifications(first: $first, after: $after) {
      edges {
        node {
          id
          title
          body
          image
          userId
          typeId
          read
          type
          senderProfile {
            ... CreatorFragment
          }
          meta {
            claimId
            argumentId
            elementId
            commentId
            mentionType
            storyId
          }
          createdTime
        }
        cursor
      }
      ... PageInfoFragment
    }
  }
  ${PAGE_INFO_FRAGMENT}
  ${CREATOR_FRAGMENT}
`;

export default NOTIFICATIONS_QUERY;
