import {
  Box,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

interface CreateCommunityProps {
  isOpen: boolean;
  onCloseHandler: () => void;
}

export default function CreateCommunityModal({
  isOpen,
  onCloseHandler,
}: CreateCommunityProps) {
  const [communityName, setCommunityName] = useState('');
  const [charsRemaingingNumber, setCharsRemainingNumber] = useState(21);

  const communityNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    setCharsRemainingNumber(21 - event.target.value.length);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          display="flex"
          flexDirection="column"
          fontSize={15}
          padding={3}
        >
          Create a community
        </ModalHeader>
        <Box pl={3} pr={3}>
          <Divider />
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" padding={4}>
            <Text fontSize={15} fontWeight={600}>
              Name
            </Text>
            <Text fontSize={13} color="gray.500" mb={2}>
              Community names including capitalization cannnot be changed
            </Text>
            {/* <Text position='relative' top={7} left={2} width={6} >/r</Text> */}
            <Input
              position="relative"
              value={communityName}
              size="sm"
              pl={2}
              onChange={communityNameChangeHandler}
            />
            <Text color={charsRemaingingNumber === 0 ? 'red' : 'gray.500'} fontSize='sm' mt={1} pl={2}>
              {charsRemaingingNumber} Characters remaining
            </Text>
          </ModalBody>
        </Box>
        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Close
          </Button>
          <Button variant="ghost">Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
