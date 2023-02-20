import { Flex } from '@chakra-ui/react';
import AuthButtons from '@/components/Navbar/RightContent/AuthButtons';
import AuthModal from '@/components/Modal/Auth';
import { signOut, User } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';
import Icons from '@/components/Navbar/RightContent/Icons';

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
      {/* <Menu /> */}
    </>
  );
};

export default RightContent;
