import { ChangeEvent } from 'react';
import { Button, Flex, Input, Textarea } from '@chakra-ui/react';

interface PostFormProps {
  postText: { title: string, description: string };
  postTextChangeHandler: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function TextInputs({ postText, postTextChangeHandler, submitHandler, isLoading }: PostFormProps) {
  return (
    <Flex direction="column" width="100%" padding={4}>
      <form onSubmit={submitHandler}>
        <Input
          name="title"
          value={postText.title}
          placeholder="title"
          borderRadius={4}
          _placeholder={{ color: 'gray.500' }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: '1px solid',
            borderColor: 'black',
          }}
          mb={2}
          onChange={postTextChangeHandler}
        />
        <Textarea
          name="description"
          value={postText.description}
          placeholder="description"
          height="200px"
          borderRadius={4}
          _placeholder={{ color: 'gray.500' }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: '1px solid',
            borderColor: 'black',
          }}
          mb={4}
          onChange={postTextChangeHandler}
        />
        <Flex justifyContent="flex-end">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!postText.title}
          >
            Post
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
