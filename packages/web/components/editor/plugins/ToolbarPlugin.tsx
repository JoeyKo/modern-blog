import React from "react";
import { Button, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import {
  FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaBold,
  FaCode,
  FaHeading, FaImage, FaItalic, FaListOl, FaListUl, FaParagraph, FaQuoteLeft,
  FaRedo, FaStrikethrough, FaUnderline, FaUndo
} from 'react-icons/fa';
import { LexicalComposerContextWithEditor, useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  $createTextNode,
  $createParagraphNode,
} from 'lexical';
import {
  $setBlocksType,
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode
} from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown';
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages
} from "@lexical/code";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "quote",
  "code",
]);

const blockTypeToBlockName = {
  paragraph: "正常",
  h1: "H1标题",
  h2: "H2标题",
  h3: "H3标题",
  ul: "无序列表",
  ol: "有序列表",
  quote: "引用",
  code: "代码片段",
};

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [codeLanguage, setCodeLanguage] = React.useState("");
  const [blockType, setBlockType] = React.useState<keyof typeof blockTypeToBlockName>(
    "paragraph"
  );

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        console.log(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type: any = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, [editor]);

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
      {supportedBlockTypes.has(blockType) && (
        <BlockOptionsDropdownList
          editor={editor}
          blockType={blockType}
        />
      )}
      {blockType === "code" ? (
        null
      ) : (
        <>
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
            onClick={() => editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              altText: "Pink flowers",
              src:
                "https://images.pexels.com/photos/5656637/pexels-photo-5656637.jpeg?auto=compress&cs=tinysrgb&w=200"
            })}
            icon={<FaImage />}
            aria-label={"图片"}
          />
          <IconButton
            size={"sm"}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
            icon={<FaAlignLeft />}
            aria-label={"居左对齐"}
          />
          <IconButton
            size={"sm"}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
            icon={<FaAlignCenter />}
            aria-label={"居中对齐"}
          />
          <IconButton
            size={"sm"}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
            icon={<FaAlignRight />}
            aria-label={"居右对齐"}
          />
          <IconButton
            size={"sm"}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
            icon={<FaAlignJustify />}
            aria-label={"两端对齐"}
          />
        </>
      )}
    </HStack>
  )
}

const BlockOptionsDropdownList = ({
  editor,
  blockType,
}: {
  editor: LexicalComposerContextWithEditor[0],
  blockType: keyof typeof blockTypeToBlockName,
}) => {
  const formatList = (listType: string) => {
    console.log(blockType);
    if (listType === "paragraph" && blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    } else if (listType === "h1" && blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h1"));
        }
      });
    } else if (listType === "h2" && blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    } else if (listType === "h3" && blockType !== "h3") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h3"));
        }
      });
    } else if (listType === "quote" && blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else if (listType === "code" && blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    } else if (listType === "ol" && blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else if (listType === "ul" && blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <Menu>
      <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
        {blockTypeToBlockName[blockType]}
      </MenuButton>
      <MenuList>
        <MenuItem icon={<FaParagraph />} onClick={() => formatList('paragraph')}>{blockTypeToBlockName['paragraph']}</MenuItem>
        <MenuItem icon={<FaHeading />} onClick={() => formatList('h1')}>{blockTypeToBlockName['h1']}</MenuItem>
        <MenuItem icon={<FaHeading />} onClick={() => formatList('h2')}>{blockTypeToBlockName['h2']}</MenuItem>
        <MenuItem icon={<FaHeading />} onClick={() => formatList('h3')}>{blockTypeToBlockName['h3']}</MenuItem>
        <MenuItem icon={<FaQuoteLeft />} onClick={() => formatList('quote')}>{blockTypeToBlockName['quote']}</MenuItem>
        <MenuItem icon={<FaListUl />} onClick={() => formatList('ul')}>{blockTypeToBlockName['ul']}</MenuItem>
        <MenuItem icon={<FaListOl />} onClick={() => formatList('ol')}>{blockTypeToBlockName['ol']}</MenuItem>
        <MenuItem icon={<FaCode />} onClick={() => formatList('code')}>{blockTypeToBlockName['code']}</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ToolbarPlugin;