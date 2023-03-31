/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Flex, HStack, Input, InputGroup, InputLeftElement, Spacer } from "@chakra-ui/react"
import Image from "next/image"

const Header: React.FC = () => {

  return (
    <Flex p="2" gap='2' as="header">
      <Image
        src="/dev.svg"
        alt="Dev"
        width={40}
        height={40}
        priority
      />
      <Spacer />
      <InputGroup borderColor="twitter.500" variant="filled">
        <InputLeftElement
          pointerEvents='none'
          children={<SearchIcon color='gray.300' />}
        />
        <Input placeholder='搜索博客' />
      </InputGroup>
      <Spacer />
      <HStack>
        <Button colorScheme="twitter">登录</Button>
      </HStack>
    </Flex>
  )
}

export default Header