import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} from 'react-icons/io5';
import { IComment } from '@/components/Post/Comment/CommentInput';

interface CommentItemProps {
  comment: IComment;
  userId?: string;
}

export default function CommentItem({ comment, userId }: CommentItemProps) {
  const commentCreatedTimeDistanceFromNow = formatDistanceToNow(
    new Date(comment.createdAt.seconds * 1000)
  );

  return (
    <Flex>
      <Box mr={2}>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Flex direction='column'>
        {/* display name and posted time */}
        <Flex direction="row" alignItems="center" fontSize="8pt">
          <Text
            fontWeight={700}
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            {comment.creatorDisplayText}
          </Text>
          <Text color="gray.600" ml={2}>{commentCreatedTimeDistanceFromNow}</Text>
        </Flex>
        {/* comment content */}
        <Text fontSize="10pt" mt={2} mb={2}>{comment.text}</Text>
        {/* vote button and other func button */}
        <Flex
          direction="row"
          alignItems="center"
          cursor="pointer"
          fontWeight={600}
          color="gray.500"
        >
          <Icon as={IoArrowUpCircleOutline} fontSize={24} />
          <Icon as={IoArrowDownCircleOutline} fontSize={24} />
          {comment.creatorId === userId && (
            <>
              <Text fontSize="10pt" borderRadius={4} _hover={{ bg: 'gray.200' }} ml={1}>
                Edit
              </Text>
              <Text fontSize="10pt" borderRadius={4} _hover={{ bg: 'gray.200' }} ml={1}>
                Delete
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
