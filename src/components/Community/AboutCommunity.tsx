import { ICommunity } from '@/store/communitySlice';
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AboutCommunityProps {
  communityData: ICommunity;
}

export default function AboutCommunity({ communityData }: AboutCommunityProps) {
  const router = useRouter();

  return (
    <Box position="sticky" top="14px">
      {/* top bar */}
      <Flex
        alignContent="center"
        justifyContent="space-between"
        bg="blue.400"
        color="white"
        padding={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      {/* information contents */}
      <Flex
        direction="column"
        padding={3}
        bg="white"
        borderRadius="0px 0px 4px 4px"
      >
        <Stack spacing={2}>
          {/* community members and online number */}
          <Flex width="100%" padding={2} fontSize="10pt" fontWeight={600}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>online</Text>
            </Flex>
          </Flex>
          <Divider />
          {/* community created date */}
          <Flex
            alignContent="center"
            width="100%"
            padding={1}
            fontSize="10pt"
            fontWeight={500}
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>
                Created{' '}
                {format(
                  new Date(communityData.createdAt.seconds * 1000),
                  'yyyy/MM/dd',
                  { locale: ja }
                )}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${router.query.communityId}/submit`}>
            <Button mt={3} width='100%' height="30px">
              Create Post
            </Button>
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
}
