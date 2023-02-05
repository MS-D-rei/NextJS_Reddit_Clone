import { Button, Flex, Image } from '@chakra-ui/react';

export default function OAuthButtons() {
  return (
    <Flex direction="column" mb={4}>
      <Button variant="oauth" mb={4}>
        <Image src='/images/googlelogo.png' alt='google logo' height='1.5rem' mr={4} />
        Continue with Google
      </Button>
      <Button variant="oauth">Continue with others</Button>
    </Flex>
  );
}
