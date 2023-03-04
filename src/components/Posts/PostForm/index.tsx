import { ChangeEvent, FormEvent, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { BiPoll } from 'react-icons/bi';
import { IconType } from 'react-icons';
import TabItem from '@/components/Posts/PostForm/TabItem';
import TextInputs from '@/components/Posts/PostForm/TextInputs';
import ImageUpload from '@/components/Posts/PostForm/ImageUpload';
import { IPost } from '@/store/postSlice';
import { useRouter } from 'next/router';
import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  FirestoreError,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { firestore, storage } from '@/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

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
  const [selectedFile, setSelectedFile] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

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
    const reader = new FileReader();

    // console.log(event.target.files);
    /*
    FileList {0: File, length: 1}
    0: File
    lastModified: 1672657779958
    lastModifiedDate: Mon Jan 02 2023 20:09:39 GMT+0900 () {}
    name: "2023-01-02 20.09.34.png"
    size: 24757
    type: "image/png"
    webkitRelativePath: ""
    [[Prototype]]: File
    length: 1 */

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const { communityId } = router.query;
    const postData: IPost = {
      communityId: communityId as string,
      creatorId: user.uid,
      createDisplayName: user.email!.split('@')[0],
      title: postText.title,
      description: postText.description,
      numberOfComments: 0,
      voteStatus: 0,
      createAt: serverTimestamp(),
    };

    try {
      // add post document with firestore auto-generated id
      const postDocRef = await addDoc(collection(firestore, 'posts'), postData);

      // check the selectedFile
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        // getDownloadURL() return imageURL as string
        const downloadURL = await getDownloadURL(imageRef);

        // update the post by adding imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(`${err.name}: ${err.message}`);
      }
      if (err instanceof FirestoreError) {
        console.log(`${err.name}: ${err.message}`);
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
  );
}
