import { Flex, Image } from '@chakra-ui/react';
import SearchInput from '@/components/Navbar/SearchInput';
import RightContent from '@/components/Navbar/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

export default function Navbar() {
  const [user, loading, authError] = useAuthState(auth);

  return (
    <Flex bg={'white'} height="3rem" padding="0.5rem 1rem">
      <Flex align="center">
        <Image src="images/redditFace.svg" alt="redditFace" height="2rem" />
        <Image
          src="images/redditText.svg"
          alt="redditText"
          height={'3rem'}
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      <SearchInput />
      {/* <Dicrectory /> */}
      <RightContent user={user} />
    </Flex>
  );
}
