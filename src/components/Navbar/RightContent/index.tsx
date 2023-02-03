import { Flex } from '@chakra-ui/react';
import AuthButtons from '@/components/Navbar/RightContent/AuthButtons';
import AuthModal from '@/components/Modal/Auth';

export default function RightContent() {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        <AuthButtons />
      </Flex>
    </>
  );
}
