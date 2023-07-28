import { useEffect, useState } from 'react';
import {
  FirestoreError,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Box } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { IPost } from '@/store/postSlice';
import { setPosts } from '@/store/postSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import CreatePostLink from '@/components/Community/CreatePostLink';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import PostItem from '@/components/Post/PostItem';
import PostLoader from '@/components/Post/PostLoader';
import { getAllCommunitySnippets, setCommunitySnippets } from '@/store/communitySlice';

export default function Home() {
  const [user, isLoadingUser] = useAuthState(auth);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [isCommunitySnippetsLoading, setIsCommunitySnippetsLoading] = useState(true);

  const dispatch = useAppDispatch();

  const reduxPostPosts = useAppSelector((state) => state.post.posts);
  const reduxCommunitySnippets = useAppSelector(
    (state) => state.community.snippets
  );

  const buildFeedForLoggedOutUser = async () => {
    setIsPostsLoading(true);
    try {
      // get first 10 posts which has the highest voteStatus
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      );
      const postQuerySnapshot = await getDocs(postQuery);
      const posts = postQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // set the 10 posts to redux
      dispatch(setPosts(posts as IPost[]));
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setFeedError(`${err.name}: ${err.message}`);
      } else if (err instanceof FirestoreError) {
        setFeedError(`${err.name}: ${err.message}`);
      } else {
        setFeedError(`Unexpected error occurred: ${err}`);
      }
    }
    setIsPostsLoading(false);
  };

  const buildFeedForLoggedInUser = async () => {
    setIsPostsLoading(true);
    try {
      // if user has no community, build feed for logged out user
      if (reduxCommunitySnippets.length === 0) {
        buildFeedForLoggedOutUser();
        setIsPostsLoading(false);
        return;
      }

      // get first 10 posts which has hightest voteStatus from user's communities
      const myCommunityIds = reduxCommunitySnippets.map(
        (snippet) => snippet.communityId
      );
      const postQuery = query(
        collection(firestore, 'posts'),
        where('communityId', 'in', myCommunityIds),
        orderBy('voteStatus', 'desc'),
        limit(10)
      );

      const postQuerySnapshot = await getDocs(postQuery);
      const posts = postQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // set the 10 posts to redux
      dispatch(setPosts(posts as IPost[]));
    } catch (err) {
      if (err instanceof Error) {
        setFeedError(`${err.name}: ${err.message}`);
      } else if (err instanceof FirestoreError) {
        setFeedError(`${err.name}: ${err.message}`);
      } else {
        setFeedError(`Unexpected error occurred: ${err}`);
      }
    }
    setIsPostsLoading(false);
  };

  // if user is logged in, get all user's community snippets
  // if user is logged out, set community snippets to empty array and display feed for logged out user
  useEffect(() => {
    if (isLoadingUser) return;
    if (user) {
      dispatch(getAllCommunitySnippets({ userId: user.uid }));
    } else {
      dispatch(setCommunitySnippets([]));
    }
    setIsCommunitySnippetsLoading(false);
  }, [isLoadingUser, user]);

  // after get or set community snippets,
  // build feed for logged in user or logged out user
  useEffect(() => {
    if (isCommunitySnippetsLoading) return;
    if (user) {
      buildFeedForLoggedInUser();
    } else {
      buildFeedForLoggedOutUser();
    }
  }, [isCommunitySnippetsLoading, user]);

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        {isPostsLoading ? (
          <PostLoader />
        ) : (
          <Box>
            {reduxPostPosts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                user={user}
                isHomePage={true}
              />
            ))}
          </Box>
        )}
      </>
      <>{/* Recommendations */}</>
    </PageContentLayout>
  );
}
