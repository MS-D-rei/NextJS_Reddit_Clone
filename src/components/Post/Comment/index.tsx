import { useCallback, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  collection,
  doc,
  FirestoreError,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IPost, selectPost } from '@/store/postSlice';
import CommentInput, { IComment } from '@/components/Post/Comment/CommentInput';
import CommentItem from '@/components/Post/Comment/CommentItem';

interface CommentsProps {
  user?: User | null;
  postId: string;
  communityId: string;
}

export default function Comments({ user, postId, communityId }: CommentsProps) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector((state) => state.post.selectedPost);

  useEffect(() => {
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
    getComments();
  }, []);

  const editCommentHandler = async (
    commentId: string,
    editCommentText: string
  ) => {
    try {
      // update comment text in firestore
      const commentDocRef = doc(firestore, 'comments', commentId);
      await updateDoc(commentDocRef, {
        text: editCommentText,
        isEdited: true,
      });

      // update comments in redux
      const commentIndex = comments.findIndex(
        (comment) => comment.id === commentId
      );
      const editedComment = {
        ...comments[commentIndex],
        text: editCommentText,
      };
      let updatedComments: IComment[] = [...comments];
      updatedComments[commentIndex] = editedComment;
      // console.log(updatedComments);
      setComments(updatedComments);
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        setError(`${err.name}: ${err.message}`);
        return;
      }
      if (err instanceof FirestoreError) {
        setError(`${err.name}: ${err.message}`);
        return;
      }
      setError(`Unexpected Error: ${err}`);
    }
  };

  const deleteCommentHandler = async (commentId: string) => {
    if (!selectedPost) return;

    try {
      const batch = writeBatch(firestore);

      // delete comment document
      const commentDocRef = doc(firestore, 'comments', commentId);
      batch.delete(commentDocRef);

      // update the numberOfComments of the post in firestore
      const postDocRef = doc(firestore, 'posts', postId);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      batch.commit();

      // update the numberOfComments of the post in redux
      const updatedPost: IPost = {
        ...selectedPost,
        numberOfComments: selectedPost.numberOfComments - 1,
      };
      dispatch(selectPost(updatedPost));

      // update comments in redux
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        setError(`${err.name}: ${err.message}`);
        return;
      }
      if (err instanceof FirestoreError) {
        setError(`${err.name}: ${err.message}`);
        return;
      }
      setError(`Unexpected Error: ${err}`);
    }
  };

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
        {comments.length !== 0 ? (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                userId={user?.uid}
                postId={postId}
                onEdit={editCommentHandler}
                onDelete={deleteCommentHandler}
              />
            ))}
          </>
        ) : (
          <Flex
            justifyContent="center"
            padding={20}
            borderTop="1px solid"
            borderColor="gray.100"
            mt={4}
          >
            <Text fontWeight={700} opacity={0.3}>
              No Comments Yet
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
