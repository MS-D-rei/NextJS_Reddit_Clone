import { ChangeEvent, FormEvent, useState } from 'react';
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
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { z, ZodFormattedError } from 'zod';
import { FIREBASE_ERRORS } from '@/firebase/errors';

export default function Login() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] =
    useState<ZodFormattedError<{ email: string; password: string }, string>>();

  const [signinWithEmailAndPassword, user, loading, googleOAuthError] =
    useSignInWithEmailAndPassword(auth);

  const dispatch = useAppDispatch();

  const loginInputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const formInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  // Firebase logic
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // initialize errors
    if (errors) setErrors(undefined);

    // email and password validation
    const validationResult = loginInputSchema.safeParse({
      email: formState.email,
      password: formState.password,
    });
    if (!validationResult.success) {
      setErrors(validationResult.error.format());
      return;
    }

    signinWithEmailAndPassword(formState.email, formState.password);
  };

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
      {errors && (
        <>
          <Text textAlign="center" color="red.500" fontSize="xl">
            {errors.email?._errors}
          </Text>
          <Text textAlign="center" color="red.500" fontSize="xl">
            {errors.password?._errors}
          </Text>
        </>
      )}
      {googleOAuthError && (
        <Text textAlign="center" color="red.500" fontSize="xl">
          {FIREBASE_ERRORS[googleOAuthError.message]}
        </Text>
      )}
      <Button
        type="submit"
        width="100%"
        height="2rem"
        mt="2"
        mb="4"
        isLoading={loading}
      >
        Log in
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text mr={2}>Forget your password?</Text>
        <Text
          color="blue.500"
          fontWeight={600}
          cursor="pointer"
          onClick={() => {
            dispatch(changeView('resetPassword'));
          }}
        >
          Reset
        </Text>
      </Flex>
      <Flex justifyContent="center">
        <Text mr={2}>New here?</Text>
        <Text
          color="blue.500"
          fontWeight={800}
          cursor="pointer"
          onClick={() => {
            dispatch(changeView('signup'));
          }}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
}
