import { Button, Flex } from '@chakra-ui/react';
import AuthButtons from '@/components/Navbar/RightContent/AuthButtons';
import AuthModal from '@/components/Modal/Auth';
import { signOut, User } from 'firebase/auth';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

interface RightContentProps {
  user: User | null | undefined;
}

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  const signOutHandler = async () => {
    await signOut(auth);
  }

  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Button onClick={signOutHandler}>Log out</Button> : <AuthButtons />}
      </Flex>
    </>
  );
};

export default RightContent;
