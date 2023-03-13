import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deletePost, IPost, selectPost } from '@/store/postSlice';
import { Flex, Icon, Image, Skeleton, Spinner, Text } from '@chakra-ui/react';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { BsChat } from 'react-icons/bs';
import { useState } from 'react';

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
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const dispatch = useAppDispatch();
  const postState = useAppSelector((state) => state.post);

  const postCreatedTimeDistanceToNow = formatDistanceToNow(
    new Date(post.createdAt.seconds * 1000)
  );

  // console.log(new Date(post.createdAt.seconds * 1000));

  const selectPostHandler = () => {
    dispatch(selectPost(post));
  };

  const voteHandler = () => {};

  const deletePostHandler = (post: IPost) => {
    dispatch(deletePost({ post }));
  };

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
        alignItems="center"
        bg="gray.100"
        padding={2}
        width="40px"
        borderRadius={4}
      >
        <Icon
          as={voteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
          color={voteValue === 1 ? 'brand.100' : 'gray.400'}
          fontSize={22}
          cursor="pointer"
          onClick={voteHandler}
        />
        <Text fontWeight={500}>{post.voteStatus}</Text>
        <Icon
          as={true ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
          color={voteValue === 1 ? '#4379ff' : 'gray.400'}
          fontSize={22}
          cursor="pointer"
          onClick={voteHandler}
        />
      </Flex>
      {/* post content */}
      <Flex direction="column" width="100%">
        {/* post by and time diff */}
        <Flex direction="row" alignItems="center" mt={2} mb={2} ml={3}>
          <Text fontSize="9pt" color="gray.500" mr={2}>
            Posted by u/{post.createDisplayName}
          </Text>
          <Text fontSize="9pt" color="gray.500">
            {postCreatedTimeDistanceToNow} ago
          </Text>
        </Flex>
        {/* title and description */}
        <Flex direction="column" ml={3}>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.description}</Text>
        </Flex>
        {/* post image */}
        {post.imageURL && (
          <Flex justifyContent="center" padding={2}>
            {isLoadingImage && (
              <Skeleton height="200px" width="100%" borderRadius={4} />
            )}
            <Image
              src={post.imageURL}
              maxHeight="460px"
              alt="Post Image"
              display={isLoadingImage ? 'none' : 'unset'}
              onLoad={() => setIsLoadingImage(false)}
            />
          </Flex>
        )}
        {/* post bottom bar */}
        <Flex color="gray.500" fontWeight={600} ml={1} mb={0.5}>
          <Flex
            alignItems="center"
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            alignItems="center"
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            alignItems="center"
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          {/* delete bottom */}
          {userIsCreator && (
            <Flex
              alignItems="center"
              padding="8px 10px"
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor="pointer"
              onClick={() => deletePostHandler(post)}
            >
              {postState.isLoading ? (
                <Spinner size='sm' mr={2} />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                </>
              )}
              <Text fontSize="9pt">Delete</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
