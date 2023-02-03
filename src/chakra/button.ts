import { ComponentStyleConfig, StyleFunctionProps } from '@chakra-ui/react';

// Chakra UI Customize Theme
// https://chakra-ui.com/docs/styled-system/customize-theme

export const Button: ComponentStyleConfig = {
   // The styles all button have in common
  baseStyle: {
    borderRadius: '4rem',
    fontsize: '0.625rem',
    fontWeight: 700,
    _focus: {
      boxShadow: 'none',
    },
  },
  // This is static, not for responsive design.
  sizes: {
    // sm: {
    //   fontSize: 'sm',
    //   px: 4, // <-- px is short for paddingLeft and paddingRight
    //   py: 3, // <-- py is short for paddingTop and paddingBottom
    // },
    // md: {
    //   fontSize: 'md',
    //   px: 6, // <-- these values are tokens from the design system
    //   py: 4, // <-- these values are tokens from the design system
    // },
  },
  variants: {
    solid: (props: StyleFunctionProps) => ({
      color: 'white',
      bg: 'blue.500',
      _hover: {
        bg: 'blue.400',
      },
    }),
    outline: (props: StyleFunctionProps) => ({
      color: 'blue.500',
      border: '1px solid',
      borderColor: 'blue.500',
    }),
    oauth: (props: StyleFunctionProps) => ({
      height: '2rem',
      border: '1px solid',
      borderColor: 'gray.300',
      _hover: {
        bg: 'gray.50',
      },
    }),
  },
};
