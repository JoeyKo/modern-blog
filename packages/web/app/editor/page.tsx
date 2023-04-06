"use client"

import ArticleEditor from '@/components/editor/editor'
import { Box, Button, HStack, Input, Text } from '@chakra-ui/react'

export default function Editor() {

  return (
    <Box>
      <HStack h="56px" spacing={5} px='2'>
        <Input variant="filled" placeholder="请输入标题" />
        <Text as="span" whiteSpace={"nowrap"} color={"gray.500"} fontSize={"sm"}>文章自动保存至草稿箱</Text>
        <Button colorScheme="twitter">发布</Button>
      </HStack>
      <ArticleEditor />
    </Box>
  )
}
