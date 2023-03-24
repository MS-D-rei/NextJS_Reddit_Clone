import { Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export default function PageContentLayout({ children }: PropsWithChildren<{}>) {
  // console.log(children);
  // 0: {$$typeof: Symbol(react.element), type: Symbol(react.fragment), key: null, ref: null, props: {children: 'left side content'}, …}
  // 1: {$$typeof: Symbol(react.element), type: Symbol(react.fragment), key: null, ref: null, props: {children: 'right side content'}, …}

  return (
    <Flex justifyContent="center" padding="1rem 0">
      <Flex
        width="95%"
        justifyContent="center"
        maxWidth="860px"
        // border="1px solid green"
      >
        {/* left side content */}
        <Flex
          direction="column"
          width={{ base: '100%', md: '65%' }}
          mr={{ base: 0, md: 6 }}
          // border="1px solid blue"
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        {/* right side content */}
        <Flex
          direction="column"
          display={{ base: 'none', md: 'flex' }}
          flexGrow={1}
          // border="1px solid orange"
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
}
