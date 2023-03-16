import { useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Flex, Icon, Image, Skeleton, Spinner, Text } from '@chakra-ui/react';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';
import { BsChat } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deletePost,
  IPost,
  IPostVote,
  selectPost,
  setPosts,
  setPostVotes,
} from '@/store/postSlice';
import { openModal } from '@/store/authModalSlice';
import { collection, doc, updateDoc, writeBatch } from 'firebase/firestore';

interface PostItemProps {
  post: IPost;
  userIsCreator: boolean;
  voteValue: number;
}

export default function PostItem({
  post,
  userIsCreator,
  voteValue,
}: PostItemProps) {
  console.log(`${post.id} rendered`);

  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const dispatch = useAppDispatch();
  const postState = useAppSelector((state) => state.post);
  const communityState = useAppSelector((state) => state.community);

  const [user] = useAuthState(auth);

  const postCreatedTimeDistanceToNow = formatDistanceToNow(
    new Date(post.createdAt.seconds * 1000)
  );

  // console.log(new Date(post.createdAt.seconds * 1000));

  const selectPostHandler = () => {
    dispatch(selectPost(post));
  };

  const voteHandler = async (voteType: number) => {
    console.log(`voted at ${post.id}`);

    // if not logged in, open auth modal.
    if (!user) {
      dispatch(openModal('login'));
      return;
    }

    try {
      // specify user's postVote for the current post
      const existingPostVote = postState.postVotes.find(
        (postVote) => postVote.postId === post.id
      );

      // 3 factors to update in this function
      let newTotalVoteStatus = post.voteStatus;
      let newPostVotes = [...postState.postVotes];
      let newPosts = [...postState.posts];

      // batch writing
      const batch = writeBatch(firestore);

      // when has not voted yet
      if (!existingPostVote) {
        // create new postVote document to postVotes which is user's subcollection.
        // get postVote document reference with auto-generated ID
        const postVoteDocRef = doc(
          collection(firestore, 'users', `${user.uid}/postVotes`)
        );

        const newPostVote: IPostVote = {
          id: postVoteDocRef.id,
          postId: post.id!,
          communityId: communityState.currentCommunity?.id!,
          voteNumber: voteType,
        };

        batch.set(postVoteDocRef, newPostVote);

        // add/subtract newTotalVoteStatus
        newTotalVoteStatus += voteType;
        // add the new postVote to postState.postVotes
        newPostVotes = [...postState.postVotes, newPostVote];
      } else {
        // when has voted already
        // in case of click same vote type
        if (existingPostVote.voteNumber === voteType) {
          // delete postVote document
          const postVoteDocRef = doc(
            firestore,
            'users',
            `${user.uid}/postVotes/${existingPostVote.id}`
          );
          batch.delete(postVoteDocRef);

          // add/subtract newTotalVoteStatus
          newTotalVoteStatus -= voteType;
          // remove the postVote from postState.postVotes
          newPostVotes = newPostVotes.filter(
            (postVote) => postVote.postId !== post.id
          );
        }

        // in case of clicking opposite vote type
        if (existingPostVote.voteNumber === -voteType) {
          // update current postVote voteNumber field
          const postVoteDocRef = doc(
            firestore,
            'users',
            `${user.uid}/postVotes/${existingPostVote.id}`
          );
          batch.update(postVoteDocRef, {
            voteNumber: voteType,
          });

          // add/subtract newTotalVoteStatus
          newTotalVoteStatus += voteType * 2;
          // update the exisingPostVote voteNumber
          const postVoteIndex = newPostVotes.findIndex(
            (postVote) => postVote.id === existingPostVote.id
          );
          newPostVotes[postVoteIndex] = {
            ...existingPostVote,
            voteNumber: -voteType,
          };
        }
      }

      // update post's voteStatus
      const postDocRef = doc(firestore, 'posts', post.id!);
      batch.update(postDocRef, {
        voteStatus: newTotalVoteStatus,
      });

      await batch.commit();

      // update postState.posts and postState.postVotes both
      // update postState.postVotes
      dispatch(setPostVotes(newPostVotes));

      // update postState.posts[curernt post] voteStatus
      const postIndex = newPosts.findIndex((item) => item.id === post.id);
      newPosts[postIndex] = {
        ...newPosts[postIndex],
        voteStatus: newTotalVoteStatus,
      };
      dispatch(setPosts(newPosts));
    } catch (err) {
      if (err instanceof Error) {
        console.log(`${err.name}: ${err.message}`);
      }
    }
  };

  const deletePostHandler = (post: IPost) => {
    dispatch(deletePost({ post }));
  };

  return (
    <Flex
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      borderRadius={4}
      // cursor="pointer"
      _hover={{ borderColor: 'gray.500' }}
      onClick={selectPostHandler}
      mb={4}
    >
      {/* gray bar */}
      <Flex
        direction="column"
        alignItems="center"
        bg="gray.100"
        padding={2}
        width="40px"
        borderRadius={4}
      >
        <Icon
          as={voteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
          color={voteValue === 1 ? 'brand.100' : 'gray.400'}
          fontSize={22}
          cursor="pointer"
          onClick={() => voteHandler(1)}
        />
        <Text fontWeight={500}>{post.voteStatus}</Text>
        <Icon
          as={true ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
          color={voteValue === -1 ? '#4379ff' : 'gray.400'}
          fontSize={22}
          cursor="pointer"
          onClick={() => voteHandler(-1)}
        />
      </Flex>
      {/* post content */}
      <Flex direction="column" width="100%">
        {/* post by and time diff */}
        <Flex direction="row" alignItems="center" mt={2} mb={2} ml={3}>
          <Text fontSize="9pt" color="gray.500" mr={2}>
            Posted by u/{post.createDisplayName}
          </Text>
          <Text fontSize="9pt" color="gray.500">
            {postCreatedTimeDistanceToNow} ago
          </Text>
        </Flex>
        {/* title and description */}
        <Flex direction="column" ml={3}>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.description}</Text>
        </Flex>
        {/* post image */}
        {post.imageURL && (
          <Flex justifyContent="center" padding={2}>
            {isLoadingImage && (
              <Skeleton height="200px" width="100%" borderRadius={4} />
            )}
            <Image
              src={post.imageURL}
              maxHeight="460px"
              alt="Post Image"
              display={isLoadingImage ? 'none' : 'unset'}
              onLoad={() => setIsLoadingImage(false)}
            />
          </Flex>
        )}
        {/* post bottom bar */}
        <Flex color="gray.500" fontWeight={600} ml={1} mb={0.5}>
          <Flex
            alignItems="center"
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            alignItems="center"
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            alignItems="center"
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          {/* delete bottom */}
          {userIsCreator && (
            <Flex
              alignItems="center"
              padding="8px 10px"
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor="pointer"
              onClick={() => deletePostHandler(post)}
            >
              {postState.isLoading ? (
                <Spinner size="sm" mr={2} />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                </>
              )}
              <Text fontSize="9pt">Delete</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
