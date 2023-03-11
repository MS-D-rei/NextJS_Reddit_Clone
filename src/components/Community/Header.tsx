import { auth } from '@/firebase/clientApp';
import { openModal } from '@/store/authModalSlice';
import {
  getAllCommunitySnippets,
  ICommunity,
  joinCommunity,
  leaveCommunity,
} from '@/store/communitySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaReddit } from 'react-icons/fa';

interface HeaderProps {
  communityData: ICommunity;
}

export default function Header({ communityData }: HeaderProps) {
  const dispatch = useAppDispatch();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      return;
    }
    dispatch(getAllCommunitySnippets({ userId: user.uid }));
  }, [user]);

  const userCommunityState = useAppSelector((state) => state.community);

  const isJoined = !!userCommunityState.snippets.find(
    (snippet) => snippet.communityId === communityData.id
  );

  const communityJoinStateHandler = (
    communityData: ICommunity,
    isJoined: boolean
  ) => {
    if (!user) {
      // open auth modal
      dispatch(openModal('login'));
      return;
    }

    if (isJoined) {
      dispatch(leaveCommunity({communityId: communityData.id, userId: user.uid}));
      return;
    }
    dispatch(joinCommunity({ communityData, userId: user.uid }));
  };

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justifyContent="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityData.imageURL ? (
            <Image src={communityData.imageURL} />
          ) : (
            <Icon
              as={FaReddit}
              color="brand.100"
              fontSize={64}
              border="4px solid white"
              borderRadius="50%"
              position="relative"
              top={-3}
            />
          )}
          <Flex direction="column" padding="10px 16px">
            <Text fontWeight="800" fontSize="16pt">
              {communityData.id}
            </Text>
            <Text fontWeight="600" fontSize="10pt" color="gray.400">
              r/{communityData.id}
            </Text>
          </Flex>
          <Button
            variant={isJoined ? 'outline' : 'solid'}
            height="30px"
            mt={4}
            ml={4}
            isLoading={userCommunityState.isLoading}
            onClick={() => communityJoinStateHandler(communityData, isJoined)}
          >
            {isJoined ? 'Joined' : 'Join'}
          </Button>
          <Text color="red">{userCommunityState.error}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
