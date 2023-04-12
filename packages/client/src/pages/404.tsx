import { Heading, Text, HStack, Container, Link } from '@chakra-ui/react';
import Head from 'next/head';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>页面找不着</title>
      </Head>
      <Container py={10} px={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, twitter.400, twitter.600)"
          backgroundClip="text"
          mb={4}
        >
          404
        </Heading>
        <HStack>
          <Text color={'gray.500'}>
            你要访问的页面好像不存在,
          </Text>
          <Link href="/">
            返回首页
          </Link>
        </HStack>
      </Container>
    </>
  );
}