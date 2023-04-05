import { Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import PostVoteBar from '@/components/Post/PostVoteBar';
import PostContent from '@/components/Post/PostContent';
import { IPost } from '@/store/postSlice';

interface PostItemProps {
  user?: User | null;
  post: IPost;
}

export default function PostItem({
  user,
  post,
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
      <PostVoteBar post={post} user={user} isSingle={false} />
      {/* post content */}
      <PostContent post={post} user={user} />
    </Flex>
  );
}
