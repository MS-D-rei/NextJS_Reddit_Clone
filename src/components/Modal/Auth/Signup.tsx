import { ChangeEvent, FormEvent, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { changeView } from '@/store/authModalSlice';
import { useAppDispatch } from '@/store/hooks';
import { auth } from '@/firebase/clientApp';
import { z, ZodFormattedError } from 'zod';
import { FIREBASE_ERRORS } from '@/firebase/errors';

export default function Signup() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] =
    useState<ZodFormattedError<{ email: string; password: string }, string>>();

  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const dispatch = useAppDispatch();

  const signupInputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const formStateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // clear error
    if (errors) setErrors(undefined);

    // password matching
    if (formState.password !== formState.confirmPassword) {
      setErrors({
        password: { _errors: ['Passwords do not matches'] },
        _errors: [],
      });
      return;
    }

    // email and password validation
    const validationResult = signupInputSchema.safeParse({
      email: formState.email,
      password: formState.password,
    });
    if (!validationResult.success) {
      // console.log(validationResult.error.format());
      // console.log(validationResult.error.flatten());
      setErrors(validationResult.error.format());
      return;
    }

    createUserWithEmailAndPassword(formState.email, formState.password);
  };

  const viewChangeHandler = () => {
    dispatch(changeView('login'));
  };

  return (
    <form onSubmit={submitHandler}>
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
          placeholder="min 8 characters required"
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
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="confirm password"
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
      {userError && (
        <Text textAlign="center" color="red.500" fontSize="xl">
          {FIREBASE_ERRORS[userError.message]}
        </Text>
      )}
      <Button
        type="submit"
        width="100%"
        height="2rem"
        mt={2}
        mb={4}
        isLoading={loading}
      >
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
