import { IArticle } from '@/components/article-list/article-card'
import ArticleList from '@/components/article-list/article-list'
import { IUser } from '@/components/user-list/user-card'
import UserList from '@/components/user-list/user-list'
import { Link } from '@chakra-ui/next-js'
import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import { NextPageWithLayout } from './_app'
import Layout from '@/components/layout'
import { ReactElement } from 'react'

const articleList: IArticle[] = [
  {
    id: 1,
    title: "ChatGPT技术解析之：GPT写代码的能力从何而来",
    summary: '本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。',
    user: { id: 2, name: 'Joeyko' },
    coverImage: '/cover.webp',
    createdAt: '2023-2-32 08:00:00'
  },
  { id: 2, title: "sss2", summary: 'sss', user: { id: 1, name: 'Joeyko' }, createdAt: '2023-2-32 08:00:00' },
  {
    id: 3,
    title: "ChatGPT技术解析之：GPT写代码的能力从何而来",
    summary: '本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。',
    user: { id: 2, name: 'Joeyko' },
    coverImage: '/cover.webp',
    createdAt: '2023-2-32 08:00:00'
  },
  { id: 4, title: "sss2", summary: 'sss', user: { id: 1, name: 'Joeyko' }, createdAt: '2023-2-32 08:00:00' },
  {
    id: 5,
    title: "ChatGPT技术解析之：GPT写代码的能力从何而来",
    summary: '本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。',
    user: { id: 2, name: 'Joeyko' },
    coverImage: '/cover.webp',
    createdAt: '2023-2-32 08:00:00'
  },
  { id: 6, title: "sss2", summary: 'sss', user: { id: 1, name: 'Joeyko' }, createdAt: '2023-2-32 08:00:00' },
  {
    id: 7,
    title: "ChatGPT技术解析之：GPT写代码的能力从何而来",
    summary: '本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。',
    user: { id: 2, name: 'Joeyko' },
    coverImage: '/cover.webp',
    createdAt: '2023-2-32 08:00:00'
  },
  { id: 8, title: "sss2", summary: 'sss', user: { id: 1, name: 'Joeyko' }, createdAt: '2023-2-32 08:00:00' },
  {
    id: 9,
    title: "ChatGPT技术解析之：GPT写代码的能力从何而来",
    summary: '本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。本文将重点关注图中的Codex，来介绍ChatGPT是如何拥有编写代码的能力的。',
    user: { id: 2, name: 'Joeyko' },
    coverImage: '/cover.webp',
    createdAt: '2023-2-32 08:00:00'
  },
  { id: 10, title: "sss2", summary: 'sss', user: { id: 1, name: 'Joeyko' }, createdAt: '2023-2-32 08:00:00' },
]

const userList: IUser[] = [
  {
    id: 1,
    name: "Joeyko",
    avatar: '/cover.webp',
  },
  {
    id: 2,
    name: "Joeyko",
    avatar: '/cover.webp',
  },
  {
    id: 3,
    name: "Joeyko",
    avatar: '/cover.webp',
  },
  {
    id: 4,
    name: "Joeyko",
    avatar: '/cover.webp',
  }
]

const Home: NextPageWithLayout = () => {
   return (
    <Flex p="2" gap={"6"} bg={"gray.50"} margin={"0 auto"} as="main">
      <Box flex={1}>
        <ArticleList data={articleList} />
      </Box>
      <Box
        w={"320px"}
        maxH={'325px'}
        bg={"gray.50"}
        px="3" py="1"
        position={"sticky"}
        top="64px"
        borderRadius={"8"}
      >
        <UserList data={userList} />
        <Box textAlign={"center"} mt={1}>
          <Link color="twitter.500" href="/recommend">查看更多</Link>
        </Box>
      </Box>
    </Flex>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Home;
