import { Dispatch, SetStateAction } from 'react';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { IFormTab } from '@/components/Posts/NewPostForm';

interface TabItemProps {
  formTab: IFormTab;
  selected: boolean;
  // setTab: Dispatch<SetStateAction<string>>
  setTab: (value: string) => void
}

export default function TabItem({ formTab, selected, setTab }: TabItemProps) {
  const setTabHandler = () => {
    setTab(formTab.title)
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="space-evenly"
      flexGrow={1}
      fontWeight={700}
      padding="1rem 0"
      cursor="pointer"
      _hover={{ bg: 'gray.50' }}
      color={selected ? 'blue.500' : 'gray.500'}
      borderWidth={selected ? '0px 1px 2px 0px' : '0px 1px 1px 0px'}
      borderBottomColor={selected ? 'blue.500' : 'gray.200'}
      borderRightColor="gray.200"
      onClick={setTabHandler}
    >
      <Icon as={formTab.icon} />
      <Text>{formTab.title}</Text>
    </Flex>
  );
}
