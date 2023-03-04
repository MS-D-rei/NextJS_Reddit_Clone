import { Box, Text } from '@chakra-ui/react';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import NewPostForm from '@/components/Posts/PostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

export default function CommunitySubmit() {
  const [user] = useAuthState(auth);

  return (
    <PageContentLayout>
      <>
        <Box padding="1rem 0" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>{/* <AboutCommunity /> */}</>
    </PageContentLayout>
  );
}
