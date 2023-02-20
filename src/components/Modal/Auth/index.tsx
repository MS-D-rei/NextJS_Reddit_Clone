import { closeModal } from '@/store/authModalSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import AuthInputs from '@/components/Modal/Auth/AuthInputs';
import OAuthButtons from '@/components/Modal/Auth/OAuthButtons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useEffect } from 'react';
import ResetPassword from './ResetPassword';

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.authModal);

  const [user, loading, authError] = useAuthState(auth);

  // if current user exists, close auth modal
  useEffect(() => {
    if (user) dispatch(closeModal());
  }, [dispatch, user])

  const modalCloseHandler = () => {
    dispatch(closeModal());
  };
  
  const modalHeaders = {
    login: 'Login',
    signup: 'Sign up',
    resetPassword: 'Reset Password',
  }

  return (
    <Modal isOpen={state.isOpen} onClose={modalCloseHandler}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          { modalHeaders[state.view] }
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pb={6}
        >
          <Flex
            direction="column"
            align="center"
            // justify='center'
            width="100%"
            // border="1px solid red"
          >
            { state.view === 'login' || state.view === 'signup' ? (
              <>
            <OAuthButtons />
            <Text color='gray.500' fontWeight={700}>OR</Text>
            <AuthInputs />
              </>
            ) : <ResetPassword/> }
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={modalCloseHandler}>
            Close
          </Button>
        </ModalFooter>
        <Button variant="ghost">Secondary Action</Button>
      </ModalContent>
    </Modal>
  );
}
