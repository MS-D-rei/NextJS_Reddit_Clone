import CreateCommunityModal from '@/components/Modal/CreateCommunity';
import { useAppSelector } from '@/store/hooks';
import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { GrAdd } from 'react-icons/gr';
import MenuListItem from './MenulistItem';

export default function Communities() {
  const [isOpen, setIsOpen] = useState(false);

  const communitySnippets = useAppSelector((state) => state.community.snippets);

  const closeModalHandler = () => {
    setIsOpen(false);
  };
  return (
    <>
      <CreateCommunityModal
        isOpen={isOpen}
        onCloseHandler={closeModalHandler}
      />
      <Box mt={3} mb={3}>
        <Text color="gray.500" fontSize="7pt" fontWeight={700} pl={3} mb={1}>
          MODERATING
        </Text>
        {communitySnippets
          .filter((communitySnippet) => communitySnippet.isModerator)
          .map((communitySnippet) => (
            <MenuListItem
              key={communitySnippet.communityId}
              displayText={`r/${communitySnippet.communityId}`}
              imageURL={communitySnippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={3}>
        <Text color="gray.500" fontSize="7pt" fontWeight={700} pl={3} mb={1}>
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          _hover={{ bg: 'gray.100' }}
          onClick={() => setIsOpen(true)}
        >
          <Flex alignItems="center">
            <Icon as={GrAdd} fontSize={20} mr={2} />
            <Text fontSize="10pt">Create Community</Text>
          </Flex>
        </MenuItem>
        {communitySnippets.map((communitySnippet) => (
          <MenuListItem
            key={communitySnippet.communityId}
            displayText={`r/${communitySnippet.communityId}`}
            imageURL={communitySnippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
}
