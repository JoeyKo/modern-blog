import styles from '../index.module.css'

const theme = {
  rtl: styles.rtl,
  ltr: styles.ltr,
  paragraph: styles.paragraph,
  heading: {
    h1: styles.headingH1,
    h2: styles.headingH2,
    h3: styles.headingH3,
  },
  quote: styles.quote,
  text: {
    bold: styles.bold,
    italic: styles.italic,
    underline: styles.underline,
    strikethrough: styles.strikethrough,
    underlineStrikethrough: styles.underlineStrikethrough,
  },
  list: {
    nested: {
      listitem: styles.nestedListItem
    },
    ol: styles.ol,
    ul: styles.ul,
    listitem: styles.listItem,
  },
  code: styles.code,
  codeHighlight: {
    
  }
};

export default theme;
