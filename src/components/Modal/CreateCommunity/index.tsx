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
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';

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
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [user] = useAuthState(auth);

  const communityNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    setCharsRemainingNumber(21 - event.target.value.length);
  };

  const communityTypeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setCommunityType(event.target.name);
  };

  const createCommunityHandler = async () => {
    // initialize nameError.
    if (nameError) setNameError('');
    // validate the community name.
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setNameError(
        'Community names must be between 3-21 characters, and can only contain letters, numbers, or underscores.'
      );
      return;
    }
    setIsLoading(true);

    try {
      // create community document in firestore.
      // doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference<DocumentData>;
      const communityDocRef = doc(firestore, 'communities', communityName);
      // getDoc<T>(reference: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
      const communityDoc = await getDoc(communityDocRef);

      // check the community name is not taken.
      if (communityDoc.exists()) {
        throw new Error(`Sorry, ${communityName} is already taken. Try another.`);
      }

      // if valid name, create community.
      // setDoc<T>(reference: DocumentReference<T>, data: WithFieldValue<T>): Promise<void>;
      await setDoc(communityDocRef, {
        createId: user?.uid,
        createAt: serverTimestamp(),
        numberOfMembers: 1,
        privacyType: communityType,
      });
    } catch (err: any) {
      console.log(`create community error: ${err}`);
      setNameError(err.message);
    }

    setIsLoading(false);
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
              >
                {charsRemaingingNumber} Characters remaining
              </Text>
              <Text fontSize="sm" color="red.500" mt={1}>
                {nameError}
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
        <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
          <Button variant="outline" mr={3} onClick={() => {}}>
            Cancel
          </Button>
          <Button isDisabled={isLoading} variant="solid" onClick={createCommunityHandler}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
