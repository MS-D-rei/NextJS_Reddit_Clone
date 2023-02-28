import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { BiPoll } from 'react-icons/bi';
import { IconType } from 'react-icons';
import TabItem from '@/components/Posts/TabItem';

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

export default function NewPostForm() {
  const [selectedTab, setSelectedTab] = useState('');

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((tab) => (
          <TabItem formTab={tab} selected={ tab.title === selectedTab } setTab={setSelectedTab} />
        ))}
      </Flex>
      <Flex></Flex>
    </Flex>
  );
}
