import { useAppDispatch } from '@/store/hooks';
import { Flex, Icon, Image, MenuItem, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaReddit } from 'react-icons/fa';

interface MenuListItemProps {
  communityId: string;
  imageURL?: string;
}

export default function MenuListItem({
  communityId,
  imageURL,
}: MenuListItemProps) {
  const router = useRouter();
  
  const itemClickHandler = () => {
    router.push(`/r/${communityId}`);
  }

  return (
    <MenuItem width="100%" _hover={{ bg: 'gray.100' }} onClick={itemClickHandler}>
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
