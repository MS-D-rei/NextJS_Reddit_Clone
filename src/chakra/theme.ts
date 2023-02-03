import { extendTheme, StyleFunctionProps } from '@chakra-ui/react';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';

// Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    100: '#FF3c00',
    // 900: '#1a365d',
    // 800: '#153e75',
    // 700: '#2a69ac',
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
    // Button
  }
};

export const theme = extendTheme({ colors });
