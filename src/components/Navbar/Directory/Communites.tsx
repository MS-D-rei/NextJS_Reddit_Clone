import CreateCommunityModal from '@/components/Modal/CreateCommunity';
import { Flex, Icon, MenuItem } from '@chakra-ui/react';
import { useState } from 'react';
import { GrAdd } from 'react-icons/gr';

export default function Communities() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModalHandler = () => {
    setIsOpen(false);
  };
  return (
    <>
      <CreateCommunityModal isOpen={isOpen} onCloseHandler={closeModalHandler} />
      <MenuItem
        width="100%"
        _hover={{ bg: 'gray.100' }}
        onClick={() => setIsOpen(true)}
      >
        <Flex alignItems="center">
          <Icon as={GrAdd} fontSize={20} mr={2} />
          Create Community
        </Flex>
      </MenuItem>
    </>
  );
}
