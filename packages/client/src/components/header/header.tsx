/* eslint-disable react/no-children-prop */
import { EditIcon, SearchIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Button, Flex, HStack, Input, InputGroup, InputLeftElement, Spacer, useColorModeValue } from "@chakra-ui/react"
import Image from "next/image"

const Header = () => {
  return (
    <Flex
      py="2"
      px="2"
      gap='2'
      bg={'gray.50'}
      as="header" 
      boxShadow={"base"} 
      position="sticky" 
      top="0" 
      zIndex={10}
    >
      <Link href={"/"}>
        <Image
          src="/dev.svg"
          alt="Dev"
          width={40}
          style={{ minWidth: '40px', minHeight: '40px' }}
          height={40}
          priority
        />
      </Link>
      <Spacer />
      <InputGroup borderColor="twitter.500" variant="filled">
        <InputLeftElement
          pointerEvents='none'
          children={<SearchIcon color='gray.300' />}
        />
        <Input placeholder='搜索文章' _placeholder={{
          color: "gray.400"
        }} />
      </InputGroup>
      <Spacer />
      <HStack>
        <Link href="/editor"><Button colorScheme="twitter" leftIcon={<EditIcon />}>写文章</Button></Link>
        <Link href="/login"><Button colorScheme="twitter" variant="outline">登录</Button></Link>
      </HStack>
    </Flex>
  )
}

export default Header