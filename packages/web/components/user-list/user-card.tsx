import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react"
import Image from "next/image"

export interface IUser {
  id: number;
  avatar?: string;
  name: string;
}

const UserCard: React.FC<IUser> = ({
  id, avatar, name
}) => {
  return (
    <Flex h="64px" align={'center'}>
      <Image
        style={{
          borderRadius: "8px",
          width: '48px', height: '48px'
        }}
        width={48}
        height={48}
        src={avatar ?? ""}
        alt={name}
      />
      <Stack marginLeft={3} spacing={1}>
        <Heading as="h5" noOfLines={1} size='md' fontSize={"lg"}>{name}</Heading>
        <Text noOfLines={1} fontSize='sm' color="gray.400">用一句话描述自己</Text>
      </Stack>
      <Spacer />
      <Button leftIcon={<AddIcon />} size="sm" colorScheme="twitter">关注</Button>
    </Flex>
  )
}

export default UserCard;