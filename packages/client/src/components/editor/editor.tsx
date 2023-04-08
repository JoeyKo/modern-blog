import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { EditorState } from 'lexical';
import { useEffect, useState } from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import { ImageNode } from './nodes/ImageNode';
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ImagePlugin from './plugins/ImagePlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import theme from './themes/theme';
import { CAN_USE_DOM } from '@/shared/canUseDOM';

function onError(err: Error) {
  console.log(err)
}

function onChange(state: EditorState) {
  console.log(JSON.stringify(state))
}

function Placeholder() {
  return (
    <Text top={0} p={2} pointerEvents={"none"} userSelect={"none"} color={"gray.500"} position={"absolute"}>
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
      AutoLinkNode,
      LinkNode,
      ImageNode
    ],
    onError,
  };
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };

    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Container maxW={"container.lg"}>
        <ToolbarPlugin />
        <Box position={"relative"}>
          <RichTextPlugin
            contentEditable={
              <Box ref={onRef}><ContentEditable className={"ContentEditable__root"} /></Box>
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </Box>
        <AutoFocusPlugin />
        <OnChangePlugin onChange={onChange} />
        <CodeHighlightPlugin />
        <ListPlugin />
        <ImagePlugin />
        {floatingAnchorElem && !isSmallWidthViewport && (
          <>
            <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
          </>
        )}
        <LinkPlugin />
        <ClickableLinkPlugin />
        <HistoryPlugin />
      </Container>
    </LexicalComposer>
  )
}

export default ArticleEditor