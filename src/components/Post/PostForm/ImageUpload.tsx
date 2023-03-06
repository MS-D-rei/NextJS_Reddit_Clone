import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import { Button, Flex, Image } from '@chakra-ui/react';

interface ImageUploadProps {
  selectedFile?: string;
  setSelectedFile: (value: string) => void;
  imageVideoChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
}

export default function ImageUpload({
  selectedFile,
  setSelectedFile,
  imageVideoChangeHandler,
  setSelectedTab,
}: ImageUploadProps) {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  const clickFileInputHandler = () => {
    selectedFileRef.current?.click();
  };

  const backToPostHandler = () => {
    setSelectedTab('Post');
  };

  const removeSelectedFileHandler = () => {
    setSelectedFile('');
  };

  return (
    <Flex justifyContent="center" width="100%">
      {selectedFile ? (
        <Flex direction="column" alignItems='center' padding={20}>
          <Image src={selectedFile} maxWidth={{ base: '250px', md: '400px' }} />
          <Flex alignItems="center" justifyContent="center" mt={8}>
            <Button mr={4} onClick={backToPostHandler}>
              Back to Post
            </Button>
            <Button variant="outline" onClick={removeSelectedFileHandler}>
              Remove
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Flex
          justifyContent="center"
          alignItems="center"
          width="100%"
          padding={20}
          border="1px dashed"
          borderColor="gray.200"
          borderRadius={4}
        >
          <Button
            variant="outline"
            height="2rem"
            onClick={clickFileInputHandler}
          >
            Upload
          </Button>
          <input
            type="file"
            ref={selectedFileRef}
            hidden
            onChange={imageVideoChangeHandler}
          />
        </Flex>
      )}
    </Flex>
  );
}
