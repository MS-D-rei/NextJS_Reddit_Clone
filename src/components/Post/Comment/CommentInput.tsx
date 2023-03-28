import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { auth, firestore } from '@/firebase/clientApp';
import AuthButtons from '@/components/Navbar/RightContent/AuthButtons';
import {
  collection,
  doc,
  FirestoreError,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IPost, selectPost } from '@/store/postSlice';

export interface IComment {
  id: string;
  text: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  createdAt: Timestamp;
}

interface CommentInputProps {
  setComments: Dispatch<SetStateAction<IComment[]>>;
}

export default function CommentInput({ setComments }: CommentInputProps) {
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [createError, setCreateError] = useState('');

  const dispatch = useAppDispatch();

  const [user] = useAuthState(auth);
  const communityId = router.query.communityId as string;
  const selectedPost = useAppSelector((state) => state.post.selectedPost);

  if (!selectedPost) {
    return null;
  }

  const commentTextChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(event.target.value);
  };

  const createCommentHandler = async () => {
    if (!user) return;

    setIsLoadingCreate(true);

    try {
      const batch = writeBatch(firestore);
      // create comment document
      const commentDocRef = doc(collection(firestore, 'comments'));
      const newComment: IComment = {
        id: commentDocRef.id,
        text: commentText,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split('@')[0],
        communityId,
        postId: selectedPost.id!,
        postTitle: selectedPost.title,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      // Date.now() returns miliseconds from January 1st, 1970
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update numberOfComments of post in firestore
      const postDocRef = doc(firestore, 'posts', selectedPost.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // update numberOfComments of post in redux
      const updatedSelectedPost: IPost = {
        ...selectedPost,
        numberOfComments: selectedPost.numberOfComments + 1,
      };
      dispatch(selectPost(updatedSelectedPost));

      // update comments state
      setComments((prevState) => [newComment, ...prevState])
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        setCreateError(`${err.name}: ${err.message}`);
      }
      if (err instanceof FirestoreError) {
        setCreateError(`${err.name}: ${err.message}`);
      }
      setCreateError(`Unexpected Error: ${err}`);
    }

    setIsLoadingCreate(false);
  };

  return (
    <>
      {user ? (
        <>
          <Text mb={2}>
            Comment as{' '}
            <span style={{ color: '#3182CE' }}>
              {user?.email?.split('@')[0]}
            </span>
          </Text>
          <Textarea
            value={commentText}
            fontSize="10pt"
            minHeight="160px"
            placeholder="What are your thoughts?"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ outline: 'none', bg: 'white', border: '1px solid black' }}
            onChange={commentTextChangeHandler}
          />
          <Flex justifyContent='flex-end' mt={4}>
            <Button onClick={createCommentHandler}>Comment</Button>
          </Flex>
        </>
      ) : (
        <Flex alignItems='center' justifyContent='space-between' mt={4}>
          <Text>Log in or Sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </>
  );
}
