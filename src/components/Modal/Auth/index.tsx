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
} from '@chakra-ui/react';
import AuthInputs from '@/components/Modal/Auth/AuthInputs';

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.authModal);
  const modalCloseHandler = () => {
    dispatch(closeModal());
  };

  return (
    <Modal isOpen={state.isOpen} onClose={modalCloseHandler}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {state.view === 'login' && 'Login'}
          {state.view === 'signup' && 'Sign up'}
          {state.view === 'resetPassword' && 'Reset Password'}
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
            // direction="column"
            // align="center"
            // justify='center'
            width="100%"
            // border="1px solid red"
          >
            {/* <OAuthButtons /> */}
            <AuthInputs />
            {/* <ResetPassword /> */}
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
