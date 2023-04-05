import { useRouter } from 'next/router';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { TiHome } from 'react-icons/ti';
import Communities from '@/components/Navbar/Directory/Communites';
import { useAppSelector } from '@/store/hooks';

export default function Directory() {
  const router = useRouter();
  const communityName = router.query.communityId;

  console.log('rendered');

  const imageURL = useAppSelector(
    (state) => state.community.currentCommunity?.imageURL
  );

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
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width={{ base: 'auto', lg: '200px' }}
        >
          {imageURL ? (
            <Image src={imageURL} boxSize="24px" borderRadius="full" mr={2} />
          ) : (
            <Icon as={TiHome} fontSize={24} mr={{ base: 1, md: 2 }} />
          )}
          <Flex display={{ base: 'none', lg: 'flex' }}>
            {communityName ? (
              <Text fontWeight="600" fontSize='10pt'>{`r/${communityName}`}</Text>
            ) : (
              <Text fontWeight="600">Home</Text>
            )}
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
