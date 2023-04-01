import { ChatIcon, TriangleUpIcon, ViewIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { Box, Card, CardBody, Center, Divider, Heading, HStack, Icon, Text } from "@chakra-ui/react"
import Image from "next/image"
import { IUser } from "../user-list/user-card";

export interface IArticle {
  id: number;
  title: string;
  summary: string; // auto generate
  coverImage?: string;
  content?: string;
  user: IUser;
  createdAt: string;
}

const ArticleCard: React.FC<IArticle> = ({
  id, title, summary, coverImage, user, createdAt
}) => {
  return (
    <Link href={"/article/" + id}>
      <Card
        borderRadius={0}
        boxShadow={"none"}
        transition="all 0.3s"
        _hover={{
          bg: 'gray.100'
        }}
        py={1}
        direction={{ base: 'column', sm: 'row' }}
      >
        <CardBody p="2">
          <HStack align={"center"} spacing={3} mb={3}>
            <Heading as="h5" size='xs' fontWeight={500} lineHeight={"18px"} color={"gray.600"}>{user.name}</Heading>
            <Center height='16px'>
              <Divider orientation='vertical' />
            </Center>
            <Text fontSize='xs' as="span" lineHeight={"18px"} color={"gray.500"}>2天前</Text>
            <Center height='16px'>
              <Divider orientation='vertical' />
            </Center>
            <Text fontSize='xs' as="span" lineHeight={"18px"} color={"gray.500"}>前端</Text>
          </HStack>
          <Heading size="md" fontSize={"xl"}>{title}</Heading>
          <Text my={3} noOfLines={1} color={"gray.400"} fontSize={"sm"}>{summary}</Text>
          <HStack color={"gray.400"} align="center" fontSize={"sm"}>
            <Icon as={ViewIcon} />
            <Text>290</Text>
            <Icon as={TriangleUpIcon} />
            <Text>2</Text>
            <Icon as={ChatIcon} />
            <Text>1</Text>
          </HStack>
        </CardBody>
        {coverImage ?
          <Box m="2">
            <Image
              style={{
                borderRadius: "8px"
              }}
              width={180}
              height={120}
              src={coverImage}
              alt={title}
            />
          </Box> : null
        }
      </Card>
    </Link>
  )
}

export default ArticleCard;