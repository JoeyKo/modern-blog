import './index.css';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { $getRoot, $getSelection, EditorState } from 'lexical';

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { Box, Text } from '@chakra-ui/react';

import theme from './themes/theme';
import { ImageNode } from './nodes/ImageNode';
import ImagePlugin from './plugins/ImagePlugin';

function onError(err: Error) {
  console.log(err)
}

function onChange(state: EditorState) {
  state.read(() => {
    const root = $getRoot();
    const selection = $getSelection();

    console.log(selection);
  });
}

function Placeholder() {
  return (
    <Text top={0} py={2} pointerEvents={"none"} userSelect={"none"} color={"gray.500"} position={"absolute"}>
      请输入你的文章内容
    </Text>
  );
}

const ArticleEditor = () => {
  const editorConfig = {
    namespace: 'ArticleEditor',
    theme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ImageNode
    ],
    onError,
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <ToolbarPlugin />
      <Box position={"relative"}>
        <RichTextPlugin
          contentEditable={<ContentEditable className={"ContentEditable__root"} />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </Box>
      <OnChangePlugin onChange={onChange} />
      <ListPlugin />
      <ImagePlugin />
      <HistoryPlugin />
    </LexicalComposer>
  )
}

export default ArticleEditor