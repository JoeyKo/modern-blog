import React from "react";
import { Button, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Portal, Tooltip } from "@chakra-ui/react";
import {
  FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaBold,
  FaCode,
  FaHeading, FaImage, FaItalic, FaLink, FaListOl, FaListUl, FaParagraph, FaQuoteLeft,
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
  COMMAND_PRIORITY_LOW,
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
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages
} from "@lexical/code";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";
import { getSelectedNode } from "../utils/getSelectedNode";
import { sanitizeUrl } from "../utils/url";

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
  paragraph: "常规",
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
  const [isCode, setIsCode] = React.useState(false);
  const [isLink, setIsLink] = React.useState(false);
  const [codeLanguage, setCodeLanguage] = React.useState("");
  const [blockType, setBlockType] = React.useState<keyof typeof blockTypeToBlockName>(
    "paragraph"
  );
  const assetFileUploadRef = React.useRef<HTMLInputElement>(null);

  function openUpload() {
    assetFileUploadRef.current?.click();
  }

  function onFilesChange(e: any) {
    const files = e.target.files;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: files[0].name,
          captionsEnabled: false,
          src:
            reader.result
        })
      }
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  }

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
      setIsCode(selection.hasFormat('code'))

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
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
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    );
  }, [updateToolbar, editor]);

  const insertLink = React.useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <HStack
      px={2}
      py={1}
      overflow={"auto"}
      position={"sticky"}
      bg={"white"}
      borderRadius={"md"}
      top={0}
      zIndex={10}
    >
      <Tooltip label='后退'>
        <IconButton
          size={"sm"}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          isDisabled={!canUndo}
          icon={<FaUndo />}
          aria-label={"后退"}
        />
      </Tooltip>
      <Tooltip label='前进'>
        <IconButton
          size={"sm"}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          isDisabled={!canRedo}
          icon={<FaRedo />}
          aria-label={"前进"}
        />
      </Tooltip>
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
          <Tooltip label='加粗'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
              colorScheme={isBold ? "twitter" : undefined}
              icon={<FaBold />}
              aria-label={"加粗"}
            />
          </Tooltip>
          <Tooltip label='斜体'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
              colorScheme={isItalic ? "twitter" : undefined}
              icon={<FaItalic />}
              aria-label={"斜体"}
            />
          </Tooltip>
          <Tooltip label='删除线'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
              colorScheme={isStrikethrough ? "twitter" : undefined}
              icon={<FaStrikethrough />}
              aria-label={"删除线"}
            />
          </Tooltip>
          <Tooltip label='下划线'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
              colorScheme={isUnderline ? "twitter" : undefined}
              icon={<FaUnderline />}
              aria-label={"下划线"}
            />
          </Tooltip>
          <Tooltip label='代码'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
              colorScheme={isCode ? "twitter" : undefined}
              icon={<FaCode />}
              aria-label={"代码"}
            />
          </Tooltip>
          <Tooltip label='插入链接'>
            <IconButton
              size={"sm"}
              onClick={insertLink}
              colorScheme={isLink ? "twitter" : undefined}
              icon={<FaLink />}
              aria-label={"插入链接"}
            />
          </Tooltip>
          <Tooltip label='居左对齐'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
              icon={<FaAlignLeft />}
              aria-label={"居左对齐"}
            />
          </Tooltip>
          <Tooltip label='居中对齐'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
              icon={<FaAlignCenter />}
              aria-label={"居中对齐"}
            />
          </Tooltip>
          <Tooltip label='居右对齐'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
              icon={<FaAlignRight />}
              aria-label={"居右对齐"}
            />
          </Tooltip>
          <Tooltip label='两端对齐'>
            <IconButton
              size={"sm"}
              onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
              icon={<FaAlignJustify />}
              aria-label={"两端对齐"}
            />
          </Tooltip>
          <Tooltip label='上传图片'>
            <label>
              <input multiple style={{ display: 'none' }} type="file" ref={assetFileUploadRef} onChange={onFilesChange} />
              <IconButton
                size={"sm"}
                onClick={openUpload}
                icon={<FaImage />}
                aria-label={"上传图片"}
              />
            </label>
          </Tooltip>
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
      <Portal>
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
      </Portal>
    </Menu>
  )
}

export default ToolbarPlugin;