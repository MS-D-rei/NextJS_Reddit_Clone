import { Button } from '@chakra-ui/react';

export default function AuthButtons() {
  return (
    <>
      <Button
        variant="outline"
        height="1.75rem"
        fontSize={{ base: 'none', sm: '0.8rem', md: 'unset' }}
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '4rem', md: '7rem' }}
        mr={2}
      >
        Login
      </Button>
      <Button
        variant="solid"
        height="1.75rem"
        fontSize={{ base: 'none', sm: '0.8rem', md: 'unset' }}
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '4rem', md: '7rem' }}
        mr={2}
      >
        Signup
      </Button>
    </>
  );
}
