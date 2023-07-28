import { useEffect } from 'react';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
} from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openModal } from '@/store/authModalSlice';
import { getAllPosts, IPost, voteToPost } from '@/store/postSlice';

interface PostVoteBarProps {
  post: IPost;
  user?: User | null;
  isSingle: boolean;
}

export default function PostVoteBar({
  post,
  user,
  isSingle,
}: PostVoteBarProps) {
  // console.log(`${post.title} votebar rendered`);

  const dispatch = useAppDispatch();

  const reduxPostPosts = useAppSelector((state) => state.post.posts);
  const reduxPostPostVotes = useAppSelector((state) => state.post.postVotes);

  const userVoteNumber = reduxPostPostVotes.find(
    (postVote) => postVote.postId === post.id
  )?.voteNumber;

  const voteHandler = async (voteType: number) => {
    console.log(`voted at ${post.id}`);

    // if not logged in, open auth modal.
    if (!user) {
      dispatch(openModal('login'));
      return;
    }

    dispatch(
      voteToPost({
        userUid: user.uid,
        post,
        communityId: post.communityId,
        voteType: voteType,
        reduxPosts: reduxPostPosts,
        reduxPostVotes: reduxPostPostVotes,
      })
    );
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      bg={isSingle ? 'none' : 'gray.100'}
      padding={2}
      width="40px"
      borderRadius={isSingle ? '0' : '4px 0px 0px 4px'}
    >
      <Icon
        as={
          userVoteNumber === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
        }
        color={userVoteNumber === 1 ? 'brand.100' : 'gray.400'}
        fontSize={22}
        cursor="pointer"
        onClick={() => voteHandler(1)}
      />
      <Text fontWeight={500}>{post.voteStatus}</Text>
      <Icon
        as={true ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
        color={userVoteNumber === -1 ? '#4379ff' : 'gray.400'}
        fontSize={22}
        cursor="pointer"
        onClick={() => voteHandler(-1)}
      />
    </Flex>
  );
}
