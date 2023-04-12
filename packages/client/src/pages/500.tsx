import { Heading, Text, HStack, Container, Link } from '@chakra-ui/react';
import Head from 'next/head';

export default function ServerError() {
  return (
    <>
      <Head>
        <title>页面出错了</title>
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
          500
        </Heading>
        <HStack>
          <Text color={'gray.500'}>
            你要访问的页面好像出错了,
          </Text>
          <Link href="/">
            返回首页
          </Link>
        </HStack>
      </Container>
    </>
  );
}