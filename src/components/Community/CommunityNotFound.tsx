import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function CommunityNotFound() {
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' minHeight='60vh'>
      <Text mb={4}>Sorry, that community does not exist or has been banned</Text>
      <Link href={"/"}>
        <Button>GO HOME</Button>
      </Link>
    </Flex>
  )
}