import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    body: `'Noto Sans SC', sans-serif`,
  },
  initialColorMode: 'light',
  useSystemColorMode: false,
})

export default theme