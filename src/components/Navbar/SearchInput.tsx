import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { User } from 'firebase/auth';

interface SearchInputProps {
  user?: User | null;
}

export default function SearchInput({ user }: SearchInputProps) {
  return (
    <Flex flexGrow={1} maxWidth={user ? 'auto' : '700px'} mr={2} align="center">
      <InputGroup>
        <InputLeftElement pointerEvents="none" height="2rem">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search reddit"
          fontSize="0.8rem"
          _placeholder={{ color: 'gray.500' }}
          _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.400' }}
          _focus={{
            outline: 'none',
            border: '1px solid',
            borderColor: 'blue.400',
          }}
          height="2rem"
          bg="gray.50"
        />
      </InputGroup>
    </Flex>
  );
}
