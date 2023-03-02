import { Box, Text } from "@chakra-ui/react";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import NewPostForm from "@/components/Posts/PostForm";

export default function CommunitySubmit() {
  return (
    <PageContentLayout>
      <>
        <Box padding='1rem 0' borderBottom='1px solid' borderColor='white'>
          <Text>Create a post</Text>
        </Box>
        <NewPostForm />
      </>
      <>
        {/* <AboutCommunity /> */}
      </>
    </PageContentLayout>
  ) 
}
