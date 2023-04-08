import { List, ListItem, useColorModeValue } from "@chakra-ui/react"
import ArticleCard, { IArticle } from "./article-card"

interface IArticleListProps {
  data: IArticle[]
}

const ArticleList: React.FC<IArticleListProps> = ({ data }) => {
  const borderColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <List spacing={'2'}>
      {data.map(item =>
        <ListItem
          style={{ marginTop: 0 }}
          borderBottom={"1px solid"}
          borderColor={borderColor}
          key={item.id}
        >
          <ArticleCard
            id={item.id}
            title={item.title}
            coverImage={item.coverImage}
            summary={item.summary}
            user={item.user}
            createdAt={item.createdAt}
          />
        </ListItem>
      )}
    </List>
  )
}

export default ArticleList;