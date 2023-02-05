import { changeView } from '@/store/authModalSlice';
import { useAppDispatch } from '@/store/hooks';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

export default function Signup() {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });

  const dispatch = useAppDispatch();

  const formStateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const submitHandler = () => {};

  const viewChangeHandler = () => {
    dispatch(changeView('login'));
  };

  return (
    <form onSubmit={submitHandler}>
      <FormControl mb={4}>
        <FormLabel htmlFor="username">User Name</FormLabel>
        <Input
          id="username"
          type="text"
          name="username"
          placeholder="username"
          bg="gray.50"
          _placeholder={{ color: 'gray.500' }}
          _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          onChange={formStateChangeHandler}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="email"
          bg="gray.50"
          _placeholder={{ color: 'gray.500' }}
          _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          onChange={formStateChangeHandler}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Password</FormLabel>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="password"
          bg="gray.50"
          _placeholder={{ color: 'gray.500' }}
          _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          onChange={formStateChangeHandler}
        />
      </FormControl>
      <Button type="submit" width="100%" height="2rem" mt={2} mb={4}>
        Sign up
      </Button>
      <Flex justifyContent="center">
        <Text mr={2}>Already have account?</Text>
        <Text
          color="blue.500"
          fontWeight={800}
          cursor="pointer"
          onClick={viewChangeHandler}
        >
          Log in
        </Text>
      </Flex>
    </form>
  );
}
