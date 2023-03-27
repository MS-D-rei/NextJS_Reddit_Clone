import { useState } from 'react';
import { User } from 'firebase/auth';
import { Box, Flex } from '@chakra-ui/react';
import CommentInput, { IComment } from '@/components/Post/Comment/CommentInput';

interface CommentsProps {
  user?: User | null;
  postId: string;
  communityId: string;
}

export default function Comments({ user, postId, communityId }: CommentsProps) {
  const [comments, setComments] = useState<IComment[]>([]);

  const getComments = async () => {};

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" padding={2}>
      <Flex
        direction="column"
        width="100%"
        fontSize="10pt"
        pl={10}
        pr={4}
        mb={6}
      >
        <CommentInput setComments={setComments} />
      </Flex>
    </Box>
  );
}
