import { Query } from 'react-apollo';
import { ID } from 'shared/types';
import { Argument, ArgumentSorts } from 'shared/types/argument';

export interface ArgumentsQueryData {
  claimArguments: Argument[];
}

interface Variables {
  claimId: ID;
  cacheBuster?: ID;
  sort?: ArgumentSorts;
}

export default class ArgumentsQuery extends Query<ArgumentsQueryData, Variables> { }
