import { ChangeEvent, FormEvent, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Text,
} from '@chakra-ui/react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { BiPoll } from 'react-icons/bi';
import { IconType } from 'react-icons';
import { useRouter } from 'next/router';
import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  FirestoreError,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { firestore, storage } from '@/firebase/clientApp';
import TabItem from '@/components/Post/PostForm/TabItem';
import TextInputs from '@/components/Post/PostForm/TextInputs';
import ImageUpload from '@/components/Post/PostForm/ImageUpload';
import { IPost } from '@/store/postSlice';
import { useSelectFile } from '@/hooks/useSelectFile';

export interface IFormTab {
  title: string;
  icon: IconType;
}

const formTabs: IFormTab[] = [
  { title: 'Post', icon: IoDocumentText },
  { title: 'Images & Video', icon: IoImageOutline },
  { title: 'Link', icon: BsLink45Deg },
  { title: 'Poll', icon: BiPoll },
  { title: 'Talk', icon: BsMic },
];

interface NewPostFormProps {
  user: User;
}

export default function NewPostForm({ user }: NewPostFormProps) {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [postText, setPostText] = useState({
    title: '',
    description: '',
  });
  const {selectedFile, setSelectedFile, selectFile} = useSelectFile();
  const [isLoading, setIsLoading] = useState(false);
  const [submitPostError, setSubmitPostError] = useState('');

  const postTextChangeHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPostText((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const imageVideoFileChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    selectFile(event)
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    // initialize submitPostError
    setSubmitPostError('');

    // no title or no description => error
    if (postText.title === '' || postText.description === '') {
      setSubmitPostError('please input title and description both');
      setIsLoading(false);
      return;
    }

    const { communityId } = router.query;
    const postData: IPost = {
      communityId: communityId as string,
      creatorId: user.uid,
      createDisplayName: user.email!.split('@')[0],
      title: postText.title,
      description: postText.description,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    try {
      // add post document with firestore auto-generated id
      const postDocRef = await addDoc(collection(firestore, 'posts'), postData);

      // check the selectedFile
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        // uploadString(ref: StorageReference, value: string, format?: StringFormat | undefined, metadata?: UploadMetadata | undefined): Promise<UploadResult>
        await uploadString(imageRef, selectedFile, 'data_url');
        // getDownloadURL() return imageURL as string
        const downloadURL = await getDownloadURL(imageRef);

        // update the post by adding imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      router.back();
    } catch (err) {
      if (err instanceof Error) {
        console.log(`${err.name}: ${err.message}`);
        setSubmitPostError(err.message);
      }
      if (err instanceof FirestoreError) {
        console.log(`${err.name}: ${err.message}`);
        setSubmitPostError(err.message);
      }
    }

    setIsLoading(false);

    //  redirect the user backt to the communityPage using router
  };

  return (
    // PostForm Tabs
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((tab) => (
          <TabItem
            key={tab.title}
            formTab={tab}
            selected={tab.title === selectedTab}
            setTab={setSelectedTab}
          />
        ))}
      </Flex>
      {/* PostForm Text Inputs */}
      <Flex padding={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            postText={postText}
            postTextChangeHandler={postTextChangeHandler}
            submitHandler={submitHandler}
            isLoading={isLoading}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            imageVideoChangeHandler={imageVideoFileChangeHandler}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {submitPostError && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Creating post error</AlertTitle>
          <AlertDescription>{submitPostError}</AlertDescription>
        </Alert>
      )}
    </Flex>
  );
}
