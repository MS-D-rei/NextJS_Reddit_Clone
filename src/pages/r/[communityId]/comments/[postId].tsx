import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useAppSelector } from '@/store/hooks';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';
import PostVoteBar from '@/components/Post/PostVoteBar';
import PostSingleContent from '@/components/Post/PostSingleContent';

export default function PostPage() {
  const router = useRouter();
  console.log(router.query);
  // {communityId: 'FirstCommu', postId: 'ua4iKEYzyun57erxJ7CM'}

  const [user] = useAuthState(auth);
  const selectedPost = useAppSelector((state) => state.post.selectedPost!);
  const { communityId } = router.query;
  const creatorId = useAppSelector(
    (state) => state.post.selectedPost!.creatorId
  );

  console.log('post page rendered');

  return (
    <PageContentLayout>
      {/* Left side content */}
      <>
        <Flex
          bg="white"
          border="1px solid"
          borderColor="white"
          borderRadius='4px 4px 0px 0px'
          _hover={{ borderColor: 'none' }}
          mb={4}
        >
          <PostVoteBar post={selectedPost} user={user} communityId={communityId as string} isSingle={true} />
          <PostSingleContent post={selectedPost} user={user} communityId={communityId as string} creatorId={creatorId} />
        </Flex>

        {/* <Comments /> */}
      </>
      {/* Right side content */}
      <>{/* <About /> */}</>
    </PageContentLayout>
  );
}
