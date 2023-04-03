import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Box, Button, Flex, Icon, Text, Textarea } from '@chakra-ui/react';
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
  postId: string;
  onEdit: (commentId: string, editCommentText: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

export default function CommentItem({
  comment,
  userId,
  postId,
  onEdit,
  onDelete
}: CommentItemProps) {
  const [editCommentText, setEditCommentText] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const commentCreatedTimeDistanceFromNow = formatDistanceToNow(
    new Date(comment.createdAt.seconds * 1000)
  );

  const openEditHandler = () => {
    setIsEditOpen(true);
  };

  const editCommentTextChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditCommentText(event.target.value);
  };

  const editCommentHandler = () => {
    onEdit(comment.id, editCommentText);
    setIsEditOpen(false);
  }

  return (
    <Flex mt={6}>
      <Box mr={2}>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Flex direction="column" width="100%">
        {/* display name and posted time */}
        <Flex direction="row" alignItems="center" fontSize="8pt">
          <Text
            fontWeight={700}
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            {comment.creatorDisplayText}
          </Text>
          <Text color="gray.600" ml={2}>
            {commentCreatedTimeDistanceFromNow}
          </Text>
          {comment.isEdited && (
            <Text color="gray.600" ml={2}>
              (edited)
            </Text>
          )}
        </Flex>
        {/* comment content */}
        <Text fontSize="10pt" mt={2} mb={2}>
          {comment.text}
        </Text>
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
              <Text
                fontSize="10pt"
                borderRadius={4}
                _hover={{ bg: 'gray.200' }}
                ml={1}
                onClick={openEditHandler}
              >
                Edit
              </Text>
              <Text
                fontSize="10pt"
                borderRadius={4}
                _hover={{ bg: 'gray.200' }}
                ml={1}
                onClick={() => onDelete(comment.id)}
              >
                Delete
              </Text>
            </>
          )}
        </Flex>
        {isEditOpen && (
          <>
            <Textarea
              value={editCommentText}
              fontSize="10pt"
              minHeight="160px"
              placeholder="What are your thoughts?"
              _placeholder={{ color: 'gray.500' }}
              _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid black',
              }}
              onChange={editCommentTextChangeHandler}
            />
            <Flex justifyContent="flex-end" mt={4}>
              <Button
                onClick={editCommentHandler}
                fontSize={14}
              >
                update
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
