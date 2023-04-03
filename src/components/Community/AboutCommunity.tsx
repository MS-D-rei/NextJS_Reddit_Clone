import { ChangeEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { ICommunity, updateCurrentCommunityImageURL } from '@/store/communitySlice';
import { useSelectFile } from '@/hooks/useSelectFile';
import { FaReddit } from 'react-icons/fa';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { doc, FirestoreError, updateDoc } from 'firebase/firestore';
import { useAppDispatch } from '@/store/hooks';

interface AboutCommunityProps {
  communityData: ICommunity;
}

export default function AboutCommunity({ communityData }: AboutCommunityProps) {
  const router = useRouter();
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [updateImageError, setUpdateImageError] = useState('');

  const dispatch = useAppDispatch();

  const [user] = useAuthState(auth);
  const { selectedFile, setSelectedFile, selectFile } = useSelectFile();

  const changeImageHandler = () => {
    selectedFileRef.current?.click();
  };

  const updateImageHandler = async () => {
    // if no user, do nothing.
    if (!user) return;
    // if no selectedFile, do nothing.
    if (!selectedFile) return;

    setIsUploadingImage(true);

    try {
      // upload the selectedFile to fire storage.
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);

      // update the community imageURL field in firestore
      const communityDocRef = doc(firestore, 'communities', communityData.id);
      await updateDoc(communityDocRef, {
        imageURL: downloadURL,
      });

      // update user's communitySnippets in firestore
      const communitySnippetDocRef = doc(firestore, 'users', `${user.uid}/communitySnippets/${communityData.id}`)
      await updateDoc(communitySnippetDocRef, {
        imageURL: downloadURL,
      })

      // update communityState.currentCommunity
      dispatch(updateCurrentCommunityImageURL(downloadURL));
    } catch (err) {
      if (err instanceof Error) {
        console.log(`${err.name}: ${err.message}`);
        setUpdateImageError(`${err.name}: ${err.message}`);
      }
      if (err instanceof FirestoreError) {
        console.log(`${err.name}: ${err.message}`);
        setUpdateImageError(`${err.name}: ${err.message}`);
      }
    }

    setIsUploadingImage(false);
  };

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
          {/* create post button */}
          <Link href={`/r/${router.query.communityId}/submit`}>
            <Button mt={3} width="100%" height="30px">
              Create Post
            </Button>
          </Link>
          {/* community creator can change community image */}
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                    onClick={changeImageHandler}
                  >
                    Change Image
                  </Text>
                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      borderRadius="full"
                      boxSize="40px"
                      alt="CommunityImage"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (isUploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={updateImageHandler}>
                      Save Changes
                    </Text>
                  ))}
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/x-png, image/gif, image/jpeg"
                  hidden
                  ref={selectedFileRef}
                  onChange={selectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
