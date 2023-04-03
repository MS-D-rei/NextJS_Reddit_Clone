import { Flex, Icon, Image, MenuItem, Text } from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';

interface MenuListItemProps {
  communityId: string;
  imageURL?: string;
}

export default function MenuListItem({
  communityId,
  imageURL,
}: MenuListItemProps) {
  return (
    <MenuItem width="100%" _hover={{ bg: 'gray.100' }}>
      <Flex alignItems="center">
        {imageURL ? (
          <Image src={imageURL} boxSize="18px" mr={2} borderRadius="full" />
        ) : (
          <Icon as={FaReddit} fontSize={20} mr={2} />
        )}
        <Text fontSize="10pt">{`r/${communityId}`}</Text>
      </Flex>
    </MenuItem>
  );
}
