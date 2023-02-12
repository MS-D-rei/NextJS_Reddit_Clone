import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

export default function OAuthButtons() {
  const [signinWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const signinWithGoogleHandler = () => {
    signinWithGoogle()
  }

  return (
    <Flex direction="column" mb={4}>
      <Button variant="oauth" mb={4} isLoading={loading} onClick={signinWithGoogleHandler}>
        <Image
          src="/images/googlelogo.png"
          alt="google logo"
          height="1.2rem"
          mr={4}
        />
        Continue with Google
      </Button>
      <Button variant="oauth">Continue with others</Button>
      {error && (
        <Text>{error.message}</Text>
      )}
    </Flex>
  );
}
