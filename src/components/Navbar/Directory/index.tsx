import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react';
import { TiHome } from 'react-icons/ti';
import Communities from '@/components/Navbar/Directory/Communites';

export default function Directory() {
  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 0.5rem"
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
        mr={2}
        ml={{ base: 0, md: 2 }}
      >
        <Flex alignItems="center" justifyContent='space-between' width={{ base: 'auto', lg: '200px' }} >
          <Icon as={TiHome} fontSize={24} mr={{ base: 1, md: 2 }} />
          <Flex display={{ base: 'none', lg: 'flex' }}>
            <Text fontWeight='600'>Home</Text>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
}
