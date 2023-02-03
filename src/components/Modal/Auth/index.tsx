import { closeModal } from '@/store/authModalSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

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
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Lorem Ipsum</ModalBody>

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
