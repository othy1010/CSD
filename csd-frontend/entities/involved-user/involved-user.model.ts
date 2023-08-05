import { IUser } from '../user/user.model';
import { UserRole } from '../enumerations/user-role.model';

export interface IInvolvedUser {
  id: number;
  expertiseLevel?: number | null;
  userRole?: UserRole | null;
  isModerator?: boolean | null;
  isEligibleDM?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewInvolvedUser = Omit<IInvolvedUser, 'id'> & { id: null };
