import { Flex, Image } from '@chakra-ui/react';
import SearchInput from '@/components/Navbar/SearchInput';

export default function Navbar() {
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
      {/* <RightContent /> */}
    </Flex>
  );
}
