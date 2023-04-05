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
import Comments from '@/components/Post/Comment';

export default function PostPage() {
  const router = useRouter();
  // console.log(router.query);
  // {communityId: 'FirstCommu', postId: 'ua4iKEYzyun57erxJ7CM'}

  const dispatch = useAppDispatch();

  const [user, isLoadingUser] = useAuthState(auth);
  const selectedPost = useAppSelector((state) => state.post.selectedPost);

  // router.query.xxx could be undefined when first loading page.
  const communityId = router.query.communityId as string;
  const postId = router.query.postId as string;

  const creatorId = useAppSelector(
    (state) => state.post.selectedPost?.creatorId
  );

  const currentCommunityData = useAppSelector(
    (state) => state.community.currentCommunity
  );

  useEffect(() => {
    if (!selectedPost?.id && postId) {
      dispatch(getPost({ postId }));
    }
  }, [router.query, selectedPost]);

  // After getting user state, get user's postVotes if logged in.
  // If not, set postVotes to empty array.
  useEffect(() => {
    if (isLoadingUser) return;
    if (!user) {
      dispatch(setPostVotes([]));
      return;
    }
    dispatch(getPostVotes({ userId: user.uid, communityId }));
  }, [user, isLoadingUser]);

  // After getting user state, get all posts if logged in.
  useEffect(() => {
    if (!user) return;
    dispatch(getAllPosts({ communityId, }));
  }, [user]);

  useEffect(() => {
    if (!currentCommunityData?.id && communityId) {
      dispatch(getCommunityData({ communityId, }));
    }
  }, [router.query, currentCommunityData]);

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
                isSingle={true}
              />
              <PostSingleContent
                post={selectedPost}
                user={user}
                communityId={communityId}
                creatorId={creatorId!}
              />
            </Flex>

            <Comments user={user} postId={postId} />
          </>
        )}
      </>
      {/* Right side content */}
      <>{currentCommunityData && <AboutCommunity communityData={currentCommunityData} />}</>
    </PageContentLayout>
  );
}
