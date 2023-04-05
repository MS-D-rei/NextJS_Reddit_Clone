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

  const reduxPostPosts = useAppSelector((state) => state.post.posts);
  const reduxPostIsLoading = useAppSelector((state) => state.post.isLoading);

  // const user = auth.currentUser;
  const [user] = useAuthState(auth);

  useEffect(() => {
    // console.log('dispatch getAllPosts');
    dispatch(getAllPosts({ communityId: communityData.id }));
  }, [communityData.id])

  useEffect(() => {
    if (!user) return;
    // console.log('dispatch getPostVotes');
    dispatch(getPostVotes({ userUid: user.uid, communityId: communityData.id }))
  }, [user, communityData.id]);

  useEffect(() => {
    if (!user) {
      dispatch(setPostVotes([]));
    }
  }, [user])

  // const onVote = (post: IPost, voteType: number) => {
  //   if (!user) {
  //     dispatch(openModal('login'));
  //     return;
  //   }

  //   console.log(`voted to ${post.title}`);

  //   dispatch(
  //     voteToPost({
  //       userUid: user.uid,
  //       postState,
  //       post,
  //       communityId: communityData.id,
  //       voteType,
  //     })
  //   );
  // };

  return (
    <>
      {reduxPostIsLoading ? (
        <PostLoader />
      ) : (
        <Box>
          {reduxPostPosts.map((post) => (
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
