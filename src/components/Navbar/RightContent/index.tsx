import { Flex } from '@chakra-ui/react';
import { auth } from '@/firebase/clientApp';
import { signOut, User } from 'firebase/auth';
import AuthModal from '@/components/Modal/Auth';
import AuthButtons from '@/components/Navbar/RightContent/AuthButtons';
import Icons from '@/components/Navbar/RightContent/Icons';
import UserMenu from '@/components/Navbar/RightContent/UserMenu';

interface RightContentProps {
  user?: User | null;
}

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  const signOutHandler = async () => {
    await signOut(auth);
  };

  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Icons /> : <AuthButtons />}
      </Flex>
      <UserMenu user={user} />
    </>
  );
};

export default RightContent;
