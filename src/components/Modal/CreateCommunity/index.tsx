import { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';

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
  const [communityType, setCommunityType] = useState('public');

  const communityNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    setCharsRemainingNumber(21 - event.target.value.length);
  };

  const communityTypeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setCommunityType(event.target.name);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler} size={'xl'}>
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
            <Box mt={4}>
              <Text fontSize={15} fontWeight={600}>
                Name
              </Text>
              <Text fontSize={13} color="gray.500" mb={2}>
                Community names including capitalization cannnot be changed
              </Text>
              <Input
                position="relative"
                value={communityName}
                size="sm"
                pl={2}
                onChange={communityNameChangeHandler}
              />
              <Text
                color={charsRemaingingNumber === 0 ? 'red' : 'gray.500'}
                fontSize="sm"
                mt={1}
                pl={2}
              >
                {charsRemaingingNumber} Characters remaining
              </Text>
            </Box>
            <Box mt={8} mb={4}>
              <Text fontSize={15} fontWeight="600" mb={4}>
                Community Type
              </Text>
              <Stack spacing={2} ml={2}>
                <Checkbox
                  name="public"
                  isChecked={communityType === 'public'}
                  onChange={communityTypeChangeHandler}
                >
                  <Flex alignItems="center">
                    <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                    Public
                  </Flex>
                </Checkbox>
                <Text fontSize="sm">
                  Anyone can view, post, and comment to this community.
                </Text>
                <Checkbox
                  name="restricted"
                  isChecked={communityType === 'restricted'}
                  onChange={communityTypeChangeHandler}
                >
                  <Flex alignItems="center">
                    <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                    Restricted
                  </Flex>
                </Checkbox>
                <Text fontSize="sm">
                  Anyone can view this community, only approved users can post
                  and comment.
                </Text>
                <Checkbox
                  name="private"
                  isChecked={communityType === 'private'}
                  onChange={communityTypeChangeHandler}
                >
                  <Flex alignItems="center">
                    <Icon as={HiLockClosed} color="gray.500" mr={2} />
                    Private
                  </Flex>
                </Checkbox>
                <Text fontSize="sm">
                  Only approved users can view, post and comment to this
                  community.
                </Text>
              </Stack>
            </Box>
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
