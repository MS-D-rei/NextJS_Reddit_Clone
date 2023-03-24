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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deletePost, IPost, selectPost, voteToPost } from '@/store/postSlice';
import { openModal } from '@/store/authModalSlice';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import PostVoteBar from './PostVoteBar';
import PostContent from './PostContent';

interface PostItemProps {
  user?: User | null;
  post: IPost;
  communityId: string;
  creatorId: string;
}

export default function PostItem({
  user,
  post,
  communityId,
  creatorId,
}: PostItemProps) {

  return (
    <Flex
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      borderRadius={4}
      _hover={{ borderColor: 'gray.500' }}
      mb={4}
    >
      {/* gray vote bar */}
      <PostVoteBar post={post} user={user} communityId={communityId} />
      {/* post content */}
      <PostContent post={post} user={user} communityId={communityId} creatorId={creatorId} />
    </Flex>
  );
}
