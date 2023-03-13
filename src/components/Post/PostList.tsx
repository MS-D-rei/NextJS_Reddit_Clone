import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ICommunity } from '@/store/communitySlice';
import { getAllPosts } from '@/store/postSlice';
import PostItem from '@/components/Post/PostItem';
import { Box, Flex, Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';

interface PostListProps {
  communityData: ICommunity;
}

export default function PostList({ communityData }: PostListProps) {
  const dispatch = useAppDispatch();

  const postState = useAppSelector((state) => state.post);

  const [user] = useAuthState(auth);

  useEffect(() => {
    dispatch(getAllPosts({ communityId: communityData.id }));
  }, []);

  return (
    <>
      {postState.isLoading ? (
        <PostLoader />
      ) : (
        <Box>
          {postState.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userIsCreator={user?.uid === communityData.creatorId}
              voteValue={post.voteStatus}
            />
          ))}
        </Box>
      )}
    </>
  );
}
