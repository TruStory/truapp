import { Query } from 'react-apollo';
import { ID } from 'shared/types';
import { Comment } from 'shared/types/comments';
import { Paginated } from 'shared/types/graphql';

export interface CommentsQueryData {
  comments: Paginated<Comment>;
}

interface Variables {
  claimId: ID;
  argumentId?: ID;
  elementId?: ID;
  first?: number;
  after?: string;
}

export default class CommentsQuery extends Query<CommentsQueryData, Variables> { }
