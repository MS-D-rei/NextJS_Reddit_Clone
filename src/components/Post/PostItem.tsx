import { useAppDispatch } from '@/store/hooks';
import { IPost, selectPost } from '@/store/postSlice';
import { Flex, Icon, Image, Text } from '@chakra-ui/react';
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowUpCircleOutline, IoArrowUpCircleSharp } from 'react-icons/io5';

interface PostItemProps {
  post: IPost;
  userIsCreator: boolean;
  voteValue: number;
}

export default function PostItem({
  post,
  userIsCreator,
  voteValue,
}: PostItemProps) {
  const dispatch = useAppDispatch();

  const selectPostHandler = () => {
    dispatch(selectPost(post));
  };

  const voteHandler = () => {};

  return (
    <Flex
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      borderRadius={4}
      // cursor="pointer"
      _hover={{ borderColor: 'gray.500' }}
      onClick={selectPostHandler}
      mb={4}
    >
      {/* gray bar */}
      <Flex
        direction="column"
        alignItems='center'
        bg="gray.100"
        padding={2}
        width="40px"
        borderRadius={4}
      >
        <Icon
          as={voteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
          color={voteValue === 1 ? 'brand.100' : 'gray.400'}
          fontSize={22}
          cursor='pointer'
          onClick={voteHandler}
        />
        <Text fontWeight={500}>{post.voteStatus}</Text>
        <Icon
          as={true ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
          color={voteValue === 1 ? '#4379ff' : 'gray.400'}
          fontSize={22}
          cursor='pointer'
          onClick={voteHandler}
        />
      </Flex>
      {/* post content */}
      <Flex direction="column" width='100%'>
        <Flex direction='row' alignItems='center'>
          <Text fontSize='9pt' color='gray.500' mr={2}>Posted by u/{post.createDisplayName}</Text>
          <Text fontSize='9pt' color='gray.500'>1 day ago</Text>
        </Flex>
        <Text>{post.title}</Text>
        <Text>{post.description}</Text>
        <Image src={post.imageURL} boxSize='300px' />
      </Flex>
    </Flex>
  );
}
