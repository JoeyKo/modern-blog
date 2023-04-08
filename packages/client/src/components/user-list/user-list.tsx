import { List, ListItem } from "@chakra-ui/react"
import UserCard, { IUser } from "./user-card"

interface IUserListProps {
  data: IUser[]
}

const ArticleList: React.FC<IUserListProps> = ({ data }) => {
  return (
    <List spacing={'2'}>
      {data.map(item =>
        <ListItem key={item.id}>
          <UserCard
            id={item.id}
            name={item.name}
            avatar={item.avatar}
          />
        </ListItem>
      )}
    </List>
  )
}

export default ArticleList;