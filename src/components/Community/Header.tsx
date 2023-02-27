import { ICommunity } from '@/store/communitySlice';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';

interface HeaderProps {
  communityData: ICommunity;
}

export default function Header({ communityData }: HeaderProps) {
  // read isJoined from communitySlice
  const isJoined = false;

  return (
    <Flex direction="column" width="100%" height="10rem">
      <Box height="50%" bg="blue.500" />
      <Flex justifyContent="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityData.imageURL ? (
            <Image src={communityData.imageURL} />
          ) : (
            <Icon
              as={FaReddit}
              color="brand.100"
              fontSize={64}
              border="4px solid white"
              borderRadius="50%"
              position="relative"
              top={-3}
              // left={-3}
            />
          )}
          <Flex direction="column" padding="1rem 1rem">
            <Text fontWeight="800" fontSize="2xl">
              {communityData.id}
            </Text>
            <Text fontWeight="600" fontSize="sm" color="gray.400">
              r/{communityData.id}
            </Text>
          </Flex>
          <Button
            variant={isJoined ? 'outline' : 'solid'}
            height="2rem"
            mt={4}
            ml={4}
            // change isJoined state
            onClick={() => {}}
          >
            {isJoined ? 'Joined' : 'Join'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
