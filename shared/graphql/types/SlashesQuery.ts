import { Query } from 'react-apollo';
import { SlashWithArgument } from 'shared/types/slash';

export interface SlashesQueryData {
  slashes: SlashWithArgument[];
}

export default class SlashesQuery extends Query<SlashesQueryData> { }
