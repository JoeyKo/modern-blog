import { ChatIcon, TriangleUpIcon, ViewIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { Box, Card, CardBody, Heading, HStack, Icon, Text } from "@chakra-ui/react"
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
        p={2}
        direction={{ base: 'column', sm: 'row' }}
      >
        <CardBody p="2">
          <HStack>
            <Heading as="h5" size='xs' fontWeight={500} color={"gray.600"} mb={2}>{user.name}</Heading>
          </HStack>
          <Heading size="md" fontSize={"2xl"}>{title}</Heading>
          <Text my={2} noOfLines={1} color={"gray.400"}>{summary}</Text>
          <HStack color={"gray.400"} align="center">
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