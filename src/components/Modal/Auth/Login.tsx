import { changeView } from '@/store/authModalSlice';
import { useAppDispatch } from '@/store/hooks';
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

export default function Login() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const dispatch = useAppDispatch();

  const formInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  // Firebase logic
  const submitHandler = () => {};

  const viewChangeHandler = () => {
    dispatch(changeView('signup'))
  }

  return (
    <form onSubmit={submitHandler}>
      <FormControl mb={4}>
        <FormLabel htmlFor="email">Email</FormLabel>
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
          onChange={formInputChangeHandler}
        />
        {/* <FormHelperText>Enter your email address</FormHelperText> */}
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="password">Password</FormLabel>
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
          onChange={formInputChangeHandler}
        />
        {/* <FormHelperText>Enter your password</FormHelperText> */}
      </FormControl>
      <Button type="submit" width="100%" height="2rem" mt="2" mb="4">
        Log in
      </Button>
      <Flex justifyContent="center">
        <Text mr={2}>New here?</Text>
        <Text color="blue.500" fontWeight={800} cursor="pointer" onClick={viewChangeHandler}>
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
}
