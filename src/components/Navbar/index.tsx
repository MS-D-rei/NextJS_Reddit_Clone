import { Flex, Image } from '@chakra-ui/react';
import SearchInput from '@/components/Navbar/SearchInput';
import RightContent from '@/components/Navbar/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import Directory from '@/components/Navbar/Directory';

export default function Navbar() {
  const [user, loading, authError] = useAuthState(auth);

  return (
    <Flex
      bg={'white'}
      height="3rem"
      padding="0.5rem 1rem"
      justifyContent={{ md: 'space-between' }}
    >
      <Flex
        align="center"
        width={{ base: '40px', md: 'auto' }}
        mr={{ base: 0, md: 2 }}
      >
        <Image src="/images/redditFace.svg" alt="redditFace" height="2rem" />
        <Image
          src="/images/redditText.svg"
          alt="redditText"
          height={'3rem'}
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <Flex>
        <RightContent user={user} />
      </Flex>
    </Flex>
  );
}
