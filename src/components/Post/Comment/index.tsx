import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Box, Flex } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';
import CommentInput, { IComment } from '@/components/Post/Comment/CommentInput';
import CommentItem from '@/components/Post/Comment/CommentItem';

interface CommentsProps {
  user?: User | null;
  postId: string;
  communityId: string;
}

export default function Comments({ user, postId, communityId }: CommentsProps) {
  const [comments, setComments] = useState<IComment[]>([]);

  const getComments = async () => {
    const commentsQuery = query(
      collection(firestore, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    const commentDocs = await getDocs(commentsQuery);
    const comments = commentDocs.docs.map((doc) =>
      JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() }))
    );

    setComments(comments as IComment[]);
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" padding={2}>
      <Flex
        direction="column"
        width="100%"
        fontSize="10pt"
        pl={10}
        pr={4}
        mt={4}
        mb={4}
      >
        <CommentInput setComments={setComments} />
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} userId={user?.uid} />
        ))}
      </Flex>
    </Box>
  );
}
