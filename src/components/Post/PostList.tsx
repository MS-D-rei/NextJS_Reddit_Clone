import { memo, useCallback, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ICommunity } from '@/store/communitySlice';
import { getAllPosts, IPost, voteToPost } from '@/store/postSlice';
import PostItem from '@/components/Post/PostItem';
import { Box } from '@chakra-ui/react';
import PostLoader from './PostLoader';
import { openModal } from '@/store/authModalSlice';

interface PostListProps {
  communityData: ICommunity;
}

const PostList = ({ communityData }: PostListProps) => {
  console.log('PostList rendered');

  const dispatch = useAppDispatch();

  
  const postState = useAppSelector((state) => state.post);
  
  useEffect(() => {
    dispatch(getAllPosts({ communityId: communityData.id }));
  }, []);
  
  const [user] = useAuthState(auth);


  const onVote = (post: IPost, voteType: number) => {
    if (!user) {
      dispatch(openModal('login'));
      return;
    }

    console.log(`voted to ${post.title}`);

    dispatch(
      voteToPost({ userUid: user.uid, postState, post, communityId: communityData.id, voteType })
    );
  };

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
              userVoteNumber={
                postState.postVotes.find(
                  (postVote) => postVote.postId === post.id
                )?.voteNumber
              }
              onVote={onVote}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default PostList;
