import { HStack, IconButton } from "@chakra-ui/react";
import { FaBold, FaItalic, FaMarkdown, FaRedo, FaStrikethrough, FaUnderline, FaUndo } from 'react-icons/fa';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  $createTextNode,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import React from "react";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown';
import { $createCodeNode, $isCodeNode } from "@lexical/code";

const LowPriority = 1;

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [updateToolbar, editor]);

  const handleMarkdownToggle = React.useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === "markdown") {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          TRANSFORMERS
        );
      } else {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        root
          .clear()
          .append(
            $createCodeNode("markdown").append($createTextNode(markdown))
          );
      }
      root.selectEnd();
    });
  }, [editor]);

  return (
    <HStack>
      <IconButton
        size={"sm"}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        isDisabled={!canUndo}
        icon={<FaUndo />}
        aria-label={"后退"}
      />
      <IconButton
        size={"sm"}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        isDisabled={!canRedo}
        icon={<FaRedo />}
        aria-label={"前进"}
      />
      <IconButton
        size={"sm"}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        colorScheme={isBold ? "twitter" : undefined}
        icon={<FaBold />}
        aria-label={"加粗"}
      />
      <IconButton
        size={"sm"}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        colorScheme={isItalic ? "twitter" : undefined}
        icon={<FaItalic />}
        aria-label={"斜体"}
      />
      <IconButton
        size={"sm"}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        colorScheme={isStrikethrough ? "twitter" : undefined}
        icon={<FaStrikethrough />}
        aria-label={"中横线"}
      />
      <IconButton
        size={"sm"}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        colorScheme={isUnderline ? "twitter" : undefined}
        icon={<FaUnderline />}
        aria-label={"下划线"}
      />
      <IconButton
        size={"sm"}
        onClick={handleMarkdownToggle}
        colorScheme={isUnderline ? "twitter" : undefined}
        icon={<FaMarkdown />}
        aria-label={"Markdown"}
      />
    </HStack>
  )
}

export default ToolbarPlugin;