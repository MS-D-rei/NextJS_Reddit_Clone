import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';
import PostVoteBar from '@/components/Post/PostVoteBar';
import PostSingleContent from '@/components/Post/PostSingleContent';
import PostLoader from '@/components/Post/PostLoader';
import { useEffect } from 'react';
import {
  getAllPosts,
  getPost,
  getPostVotes,
  setPostVotes,
} from '@/store/postSlice';
import { getCommunityData } from '@/store/communitySlice';
import AboutCommunity from '@/components/Community/AboutCommunity';

export default function PostPage() {
  const router = useRouter();
  // console.log(router.query);
  // {communityId: 'FirstCommu', postId: 'ua4iKEYzyun57erxJ7CM'}

  const dispatch = useAppDispatch();

  const [user] = useAuthState(auth);
  const selectedPost = useAppSelector((state) => state.post.selectedPost);
  const { communityId } = router.query;
  const creatorId = useAppSelector(
    (state) => state.post.selectedPost?.creatorId
  );

  const communityData = useAppSelector(
    (state) => state.community.currentCommunity
  );

  useEffect(() => {
    const postId = router.query.postId as string;

    if (postId && !selectedPost?.id) {
      dispatch(getPost({ postId }));
    }
  }, [router.query, selectedPost]);

  useEffect(() => {
    if (user) {
      dispatch(
        getPostVotes({ userUid: user.uid, communityId: communityId as string })
      );
      return;
    }
    dispatch(setPostVotes([]));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    dispatch(getAllPosts({ communityId: communityId as string }));
  }, [user]);

  useEffect(() => {
    if (!communityData?.id) {
      dispatch(getCommunityData({ communityId: communityId as string }));
    }
  }, [router.query, communityData]);

  return (
    <PageContentLayout>
      {/* Left side content */}
      <>
        {selectedPost && (
          <>
            <Flex
              bg="white"
              border="1px solid"
              borderColor="white"
              borderRadius="4px 4px 0px 0px"
              _hover={{ borderColor: 'none' }}
              mb={4}
            >
              <PostVoteBar
                post={selectedPost}
                user={user}
                communityId={communityId as string}
                isSingle={true}
              />
              <PostSingleContent
                post={selectedPost}
                user={user}
                communityId={communityId as string}
                creatorId={creatorId!}
              />
            </Flex>

            {/* <Comments /> */}
          </>
        )}
      </>
      {/* Right side content */}
      <>{communityData && <AboutCommunity communityData={communityData} />}</>
    </PageContentLayout>
  );
}
