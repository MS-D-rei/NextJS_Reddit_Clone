import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ICommunity } from '@/store/communitySlice';
import { getAllPosts, getPostVotes, setPostVotes } from '@/store/postSlice';
import PostItem from '@/components/Post/PostItem';
import PostLoader from '@/components/Post/PostLoader';

interface PostListProps {
  communityData: ICommunity;
}

const PostList = ({ communityData }: PostListProps) => {
  // console.log('PostList rendered');

  const dispatch = useAppDispatch();

  const posts = useAppSelector((state) => state.post.posts);
  const isLoadingPosts = useAppSelector((state) => state.post.isLoading);

  const [user] = useAuthState(auth);

  useEffect(() => {
    dispatch(getAllPosts({ communityId: communityData.id }));
  }, [communityData.id])

  useEffect(() => {
    if (!user) return;
    dispatch(getPostVotes({ userId: user.uid, communityId: communityData.id }))
  }, [user, communityData.id]);

  useEffect(() => {
    if (!user) {
      dispatch(setPostVotes([]));
    }
  }, [user])

  return (
    <>
      { isLoadingPosts ? (
        <PostLoader />
      ) : (
        <Box>
          {posts.map((post) => (
            <PostItem
              key={post.id}
              user={user}
              post={post}
              isHomePage={false}
            />
          ))}
        </Box>
      )}
    </>
  );

};

export default PostList;
