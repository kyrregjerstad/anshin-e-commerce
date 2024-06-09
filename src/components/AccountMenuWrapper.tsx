import { validateRequest } from '@/lib/auth';
import { logOut } from '@/lib/server/services/authService';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { UserAccountMenu } from './UserAccountMenu';

/* We need this wrapper so that we can use a suspense fallback while the user is loading */
export const AccountMenuWrapper = async () => {
  const { user } = await validateRequest();
  return (
    <UserAccountMenu user={user} logOutAction={logOut}>
      <UserCircleIcon className="size-8 stroke-neutral-700" strokeWidth={1.3} />
    </UserAccountMenu>
  );
};
