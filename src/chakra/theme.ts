import { extendTheme, StyleFunctionProps } from '@chakra-ui/react';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import { Button } from '@/chakra/button';

export const theme = extendTheme({
  colors: {
    brand: {
      100: '#FF3c00',
    },
  },
  fonts: {
    body: 'Open Sans, sans-serif',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: 'gray.200',
      },
    }),
  },
  components: {
    Button,
  },
});
