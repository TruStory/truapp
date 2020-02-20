import { Query } from 'react-apollo';
import { ID } from 'shared/types';
import { Argument } from 'shared/types/argument';

export interface ArgumentQueryData {
  claimArgument: Argument;
}

interface Variables {
  argumentId: ID;
}

export default class ArgumentQuery extends Query<ArgumentQueryData, Variables> { }
