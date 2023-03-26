import { ChangeEvent, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { auth } from '@/firebase/clientApp';
import AuthButtons from '@/components/Navbar/RightContent/AuthButtons';

interface CommentInputProps {

}

export default function CommentInput() {
  const [commentText, setCommentText] = useState('');

  const [user] = useAuthState(auth);

  const commentTextChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(event.target.value);
  };

  const createCommentHandler = async (commentText: string) => {
    // create comment document
    // update numberOfComments of post in firestore

    // update numberOfComments of post in redux
  }

  return (
    <>
      {user ? (
        <>
          <Text>
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
          <Flex>
            <Button>Comment</Button>
          </Flex>
        </>
      ) : (
        <Flex>
          <Text>Log in or Sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </>
  );
}
