import { signOut, User } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaRedditSquare } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineLogin } from 'react-icons/md';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/authModalSlice';

interface UserMenuProps {
  user?: User | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const dispatch = useAppDispatch();

  const openModalHandler = () => {
    dispatch(openModal('login'))
  }

  const signOutHandler = () => {
    signOut(auth);
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 0.5rem"
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
      >
        <Flex alignItems="center">
          {user ? (
            <>
              <Icon as={FaRedditSquare} fontSize={24} mr={1} color="gray.300" />
            </>
          ) : (
            <Icon as={VscAccount} fontSize={24} mr={1} color="gray.400" />
          )}
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontWeight="700"
              _hover={{ bg: 'blue.500', color: 'white' }}
            >
              <Flex alignItems="center">
                <Icon as={CgProfile} fontSize={20} mr={2} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontWeight="700"
              _hover={{ bg: 'blue.500', color: 'white' }}
              onClick={signOutHandler}
            >
              <Flex alignItems="center">
                <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            fontWeight="700"
            _hover={{ bg: 'blue.500', color: 'white' }}
            onClick={openModalHandler}
          >
            <Flex alignItems="center">
              <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
              Log in / Sign up
            </Flex>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
