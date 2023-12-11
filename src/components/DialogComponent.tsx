import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { OpenDialogContext, DialogModeContext, TagListContext, NoteContext, NotebookIdContext } from '../App';
import { TextField } from '@mui/material';
import { DialogContentType, NoteType, NotebookType, TagType, defaultDialogContent, isNotebook, isTag } from '../Object.d';
import uuid from 'react-uuid';
import { NotebooksContext, OpenDrawerContext } from './Header';
import { SetIsClickedContext, SetSortedTagListContext, TitleContext } from './TagsManager';
import { Link } from 'react-router-dom';

const DialogComponent: React.FC = () => {
   const { openDialog, setOpenDialog } = useContext(OpenDialogContext)
   const { notebooks, setNotebooks } = useContext(NotebooksContext)
   const { dialogMode }  = useContext(DialogModeContext)
   const { tagList } = useContext(TagListContext)
   const { title, setTitle } = useContext(TitleContext)
   const { setSortedTagList } = useContext(SetSortedTagListContext)
   const { setIsClicked } = useContext(SetIsClickedContext)
   const { notes, setNotes } = useContext(NoteContext)
   const { setActiveNotebookId } = useContext(NotebookIdContext)
   const { setOpenDrawer } = useContext(OpenDrawerContext)
   const [dialogContent, setDialogContent] = useState<DialogContentType>(defaultDialogContent)
   const [textFieldValue, setTextFieldValue] = useState<string>("")
   const [page, setPage] = useState<string>("")

    useEffect(() => {
      if (dialogMode.mode === "newNotebook") {
        const newContent: DialogContentType = {
          title: "ノートブックを新規作成",
          message: "ノートブックを新規作成します。ノートブックのタイトルを入力してください。",
          needForm: true,
        }
        setDialogContent(newContent)
      } else if (dialogMode.mode === "deleteNotebook" && dialogMode.object !== null) {
        const newContent: DialogContentType = {
          title: "ノートブックを削除",
          message: dialogMode.object.title + "を削除します。この操作は取り消せません。削除してもよろしいですか？",
          needForm: false,
        }
        setDialogContent(newContent)
      } else if (dialogMode.mode === "renameNotebook" && dialogMode.object !== null) {
        const newContent: DialogContentType = {
          title: "ノートブック名を変更",
          message: "ノートブック名を変更します。新しいタイトルを入力してください。",
          needForm: true,
        }
        setTextFieldValue(dialogMode.object.title)
        setDialogContent(newContent)
      } else if (dialogMode.mode === "renameTag") {
        const newContent: DialogContentType = {
          title: "タグ名を変更",
          message: "タグ名を変更します。このタグを登録しているノート全てに変更が反映されますが、よろしいですか？",
          needForm: false,
        }
        setDialogContent(newContent)

      } else if (dialogMode.mode === "deleteTag" && dialogMode.object !== null) {
        const newContent: DialogContentType = {
          title: "タグを削除",
          message: dialogMode.object.title + "を削除します。この操作は取り消せません。削除してもよろしいですか？",
          needForm: false,
        }
        setDialogContent(newContent)
      }
    },[dialogMode])

  const handleClick = () => {
    if (dialogMode.mode === "newNotebook") {
      // 入力値を元にノートブックを新規作成・登録
      const notebookId = uuid()
      const newNotebook = {
        id: notebookId,
        title: textFieldValue
      }
      setNotebooks([...notebooks, newNotebook])
      // 新しいノートブックに空白のページを登録
      const newNote: NoteType = {
        id: uuid(),
        title: "",
        content: "",
        tag: [],
        modDate: Date.now(),
        notebookid: notebookId,
      }
      setNotes([...notes, newNote])
      // TextFieldを空にする
      setTextFieldValue("")
      // activeNotebookを新しいノートブックに設定
      setActiveNotebookId(notebookId)
      // NoteBrowserに遷移
      setPage("/note")
      // Drawerを閉じる
      setOpenDrawer(false)
      // Dialogを閉じる
      setOpenDialog(false)
    } else if (dialogMode.mode === "deleteNotebook" && isNotebook(dialogMode.object)) {
        const id = dialogMode.object.id
        // notebooksから対象のノートブックを削除 
        const filterNotebooks = notebooks.filter((notebook) => notebook.id !== id)
        setNotebooks(filterNotebooks)
        // localStrageからノートブックを削除
        localStorage.removeItem(dialogMode.object.id)
        // 対象のノートブック内のノートを削除
        const newNotes = notes.filter((note) => note.notebookid !== id)
        setNotes(newNotes)
        // Homeに遷移
        setPage("/")
        // Drawerを閉じる
        setOpenDrawer(false)
        // Dialogを閉じる
        setOpenDialog(false)
    } else if (dialogMode.mode === "renameNotebook" && isNotebook(dialogMode.object)) {
      const id = dialogMode.object.id
      // 変更しないノートブックを抽出
      const filterNotebooks = notebooks.filter((notebook) => notebook.id !== id)
      // 変更したノートブックを作成
      const renamedNotebook: NotebookType = {
        id: dialogMode.object.id,
        title: textFieldValue,
      }
      setNotebooks([...filterNotebooks, renamedNotebook])
      // TextFieldを空にする
      setTextFieldValue("")
      // Dialogを閉じる
      setOpenDialog(false)
    } else if (dialogMode.mode === "renameTag" && isTag(dialogMode.object)) {
        const id: string | undefined = dialogMode.object.id
        // 名前を付け直したtagをtagListに登録
        const newTagList: TagType[] = tagList.filter((tag) => tag.id !== id)
        const renamedTag: TagType = {id: id, title: title, inputValue: ''}
        newTagList.push(renamedTag)
        setSortedTagList(newTagList)
        setIsClicked("")
        setTitle("")
        // Dialogを閉じる
        setOpenDialog(false)
    } else if (dialogMode.mode === "deleteTag" && isTag(dialogMode.object)) {
        const id: string | undefined = dialogMode.object.id
        const newTagList = tagList.filter((tag) => tag.id !== id)
        setSortedTagList(newTagList)
        setIsClicked("")
        setTitle("")
        // Dialogを閉じる
        setOpenDialog(false)
    }
  }
  
  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogContent.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent.message}
          </DialogContentText>
          {dialogContent.needForm && 
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="ノートブック名"
            fullWidth
            variant="standard"
            value={textFieldValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTextFieldValue(event.target.value)}
          />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          {page === "" ? 
          <Button onClick={handleClick}>
            確定
          </Button> :
          <Button component={Link} to={page} onClick={handleClick}>
            確定
          </Button>
        }
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogComponent