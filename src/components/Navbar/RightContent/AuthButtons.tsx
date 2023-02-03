import { openModal } from '@/store/authModalSlice';
import { useAppDispatch } from '@/store/hooks';
import { Button } from '@chakra-ui/react';

export default function AuthButtons() {
  const dispatch = useAppDispatch();

  const openLoginModalHandler = () => {
    dispatch(openModal('login'));
  };

  const openSignupModalHandler = () => {
    dispatch(openModal('signup'));
  };

  return (
    <>
      <Button
        variant="outline"
        height="1.75rem"
        fontSize={{ base: 'none', sm: '0.8rem', md: 'unset' }}
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '4rem', md: '7rem' }}
        mr={2}
        onClick={openLoginModalHandler}
      >
        Login
      </Button>
      <Button
        variant="solid"
        height="1.75rem"
        fontSize={{ base: 'none', sm: '0.8rem', md: 'unset' }}
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '4rem', md: '7rem' }}
        mr={2}
        onClick={openSignupModalHandler}
      >
        Signup
      </Button>
    </>
  );
}
