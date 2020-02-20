import gql from 'graphql-tag';

const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFragment on PageInfo {
    totalCount
    pageInfo {
      hasNextPage
      hasPrevPage
      startCursor
      endCursor
      pages
    }
  }
`;
export default PAGE_INFO_FRAGMENT;
