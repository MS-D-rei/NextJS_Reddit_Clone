import { useAppSelector } from '@/store/hooks';
import { Flex } from '@chakra-ui/react';
import Login from '@/components/Modal/Auth/Login';
import Signup from '@/components/Modal/Auth/Signup';

export default function AuthInputs() {
  const state = useAppSelector((state) => state.authModal);
  return (
    <Flex
      direction="column"
      // align="center"
      width="100%"
      mt={4}
    >
      {state.view === 'login' && <Login />}
      { state.view === 'signup' && <Signup /> }
    </Flex>
  );
}
