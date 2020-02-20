import { Query } from 'react-apollo';
import { Invite } from 'shared/types/invite';

export interface InvitesQueryData {
  invites: Invite[];
}

export default class InvitesQuery extends Query<InvitesQueryData> { }
