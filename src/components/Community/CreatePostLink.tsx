import { auth } from '@/firebase/clientApp';
import { openModal } from '@/store/authModalSlice';
import { useAppDispatch } from '@/store/hooks';
import { Flex, Icon, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsLink45Deg } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import { IoImageOutline } from 'react-icons/io5';

export default function CreatePostLink() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [user] = useAuthState(auth);
  const inputClickHandler = () => {
    if (!user) {
      dispatch(openModal('login'));
      return;
    }

    const { communityId } = router.query;
    if (communityId) {
      router.push(`/r/${communityId}/submit`);
    }
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="space-evenly"
      bg="white"
      height="3rem"
      border="1px solid"
      borderColor="gray.300"
      borderRadius={4}
      padding={2}
      mb={4}
    >
      <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
      <Input
        bg="gray.50"
        borderColor="gray.200"
        height="2rem"
        borderRadius={4}
        mr={4}
        placeholder="Create Post"
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        onClick={inputClickHandler}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        color="gray.400"
        cursor="pointer"
        mr={4}
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
    </Flex>
  );
}
