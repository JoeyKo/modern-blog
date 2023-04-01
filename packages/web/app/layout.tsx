'use client'

import '@fontsource/noto-sans-sc/400.css'

import Header from '@/components/header/header'
import theme from '@/theme'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="zh-CN">
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <Header />
            {children}
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
