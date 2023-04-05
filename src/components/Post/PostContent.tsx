import { useState } from 'react';
import { useRouter } from 'next/router';
import { User } from 'firebase/auth';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import { IoArrowRedoOutline, IoBookmarkOutline } from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';
import { Flex, Skeleton, Text, Image, Icon, Spinner } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deletePost, IPost, selectPost } from '@/store/postSlice';

interface PostContentProps {
  post: IPost;
  user?: User | null;
}

export default function PostContent({
  post,
  user,
}: PostContentProps) {
  // console.log(`${post.title} content rendered`);

  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const reduxPostIsLoading = useAppSelector((state) => state.post.isLoading);

  const postCreatedTimeDistanceToNow = formatDistanceToNow(
    new Date(post.createdAt.seconds * 1000)
  );
  // console.log(new Date(post.createdAt.seconds * 1000));

  const userIsCreator = user?.uid === post.creatorId;

  const selectPostHandler = () => {
    dispatch(selectPost(post));
    router.push({
      pathname: `/r/${post.communityId}/comments/${post.id}`,
      // query: { creatorId, postData: JSON.stringify(post) },
    });
  };

  const deletePostHandler = (post: IPost) => {
    dispatch(deletePost({ post }));
  };

  return (
    <Flex direction="column" width="100%">
      <Flex
        direction="column"
        width="100%"
        cursor="pointer"
        onClick={selectPostHandler}
      >
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
      </Flex>
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
            {reduxPostIsLoading ? (
              <Spinner size="sm" mr={2} />
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
  );
}
