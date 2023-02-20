import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { BsReddit, BsDot } from 'react-icons/bs';
import { useAppDispatch } from '@/store/hooks';
import { changeView } from '@/store/authModalSlice';
import { FIREBASE_ERRORS } from '@/firebase/errors';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const [sendPasswordResetEmail, sending, sendEmailError] =
    useSendPasswordResetEmail(auth);

  const emailChangeHander = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const dispatch = useAppDispatch();

  const submitHander = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await sendPasswordResetEmail(email);
    setSuccess(result);
  };

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize="3rem" mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>
      {success ? (
        <Text fontWeight="700" mb={2}>
          Check your email :)
        </Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center">
            Enter the email associated with your account
          </Text>
          <Text fontSize="sm" textAlign="center" mb={4}>
            We will send you a reset link
          </Text>
          <form onSubmit={submitHander} style={{ width: '100%' }}>
            <FormControl mb={2}>
              <Input
                mb={2}
                required
                id="email"
                type="email"
                name="email"
                placeholder="email"
                bg="gray.50"
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                  bg: 'white',
                  border: '1px solid',
                  borderColor: 'blue.500',
                }}
                _focus={{
                  outline: 'none',
                  bg: 'white',
                  border: '1px solid',
                  borderColor: 'blue.500',
                }}
                onChange={emailChangeHander}
              />
              <Text textAlign="center" color="red.500" fontSize="1rem">
                {sendEmailError && FIREBASE_ERRORS[sendEmailError.message]}
              </Text>
            </FormControl>
            <Button type="submit" width="100%" height="2rem" mt={2} mb={4}>
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex mb={2} alignItems="center" justifyContent="center">
        <Text
          mr={2}
          fontWeight={700}
          color="blue.500"
          cursor="pointer"
          onClick={() => {
            dispatch(changeView('login'));
          }}
        >
          Login
        </Text>
        <Icon as={BsDot} mr={2} />
        <Text
          fontWeight={700}
          color="blue.500"
          cursor="pointer"
          onClick={() => {
            dispatch(changeView('signup'));
          }}
        >
          SIGN UP
        </Text>
      </Flex>
    </Flex>
  );
}
