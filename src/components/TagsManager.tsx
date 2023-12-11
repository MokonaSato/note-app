//import React from 'react'

import { Box, Button, IconButton, TextField, Typography } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { createContext, useContext, useState } from "react";
import { DialogModeContext, NoteContext, OpenDialogContext, TagListContext } from "../App";
import { TagType, } from "../Object.d";
import DialogComponent from "./DialogComponent";

// コンテキストの作成
export const TitleContext = createContext<{ 
  title: string, 
  setTitle: (title: string) => void 
}>({
  title: '',
  setTitle: () => {},
});

type SetSortedTagListType ={
  setSortedTagList: (tagList: TagType[]) => void
}

export const SetSortedTagListContext = createContext<SetSortedTagListType>({setSortedTagList: () => {}})

type SetIsClickedType ={
  setIsClicked: (isClicked: string) => void
}

export const SetIsClickedContext = createContext<SetIsClickedType>({setIsClicked: () => {}})

const TagManager = () => {
  const { tagList, setTagList } = useContext(TagListContext)
  const { notes } = useContext(NoteContext)
  const [ isClicked, setIsClicked ] = useState<string>("")
  const [ title, setTitle ] = useState<string>("")
  const { setDialogMode } = useContext(DialogModeContext)
  const { setOpenDialog } = useContext(OpenDialogContext)

  const getTaggedNotes = (id: string | undefined) => {
    let count: number = 0
    for (const note of notes) {
      if (typeof id === 'string' && note.tag.includes(id)){
        count = count + 1
      }
    }
    return count
  }

  const setSortedTagList = (tags: TagType[]) => {
    if (tags.length > 1) {
      const newTagList = tags.sort((a, b) => {
        if (a.id !== undefined || b.id !== undefined) {
          if (a.id === undefined) return -1;
          if (b.id === undefined) return 1;
        }
      
        if (a.id !== undefined && b.id !== undefined) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
        }
      
        return 0;
      })
      setTagList(newTagList)
    } else {
      return setTagList(tags);
    }
  }

  const renameTag = (tag: TagType) => {
    setTitle(tag.title)
    setIsClicked(tag.id as string)
  }

  const handlerOpenDialog = (mode: string, object: TagType) => {
    console.log("handleOpenDialog")
    setDialogMode({mode, object})
    setOpenDialog(true)
  }

  const handlerCloseDialog = () => {
    setTitle("")
    setIsClicked("")
    setOpenDialog(false)
  }

  return (
    <TitleContext.Provider value={{title, setTitle}}>
      <SetSortedTagListContext.Provider value={{setSortedTagList}}>
        <SetIsClickedContext.Provider value={{setIsClicked}}>
          <Box sx={{ display: 'flex', flexDirection: 'column' ,bgcolor: 'grey.50', mt: 9 }}>
            <Typography component="h2" variant="h5" sx={{mt: 1}}>
              タグ一覧
            </Typography>
            <TableContainer component={Paper} sx={{mt: 2}}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>タグ名</TableCell>
                    <TableCell align="right">アクション</TableCell>
                    <TableCell align="right">ノート数</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tagList.map((tag) => (
                    <TableRow
                      key={tag.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {tag.id === isClicked ? 
                        <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="ノートブック名"
                        variant="standard"
                        value={title}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                        sx ={{ width: '500px' }}
                        /> 
                        : 
                        tag.title}
                      </TableCell>
                      <TableCell align="right">
                        {tag.id === isClicked ? 
                        <>
                        <Button 
                        variant="contained" 
                        onClick={() => handlerOpenDialog("renameTag", tag)}
                        sx={{ mr: 1 }}>確定
                        </Button>
                        <Button 
                        variant="contained" 
                        onClick={handlerCloseDialog}
                        >キャンセル</Button>
                        </> :
                        <>
                        <IconButton onClick={() => renameTag(tag)}>
                          <EditIcon/>
                        </IconButton>
                        <IconButton onClick={() => handlerOpenDialog("deleteTag", tag)}>
                          <DeleteIcon/>
                        </IconButton>
                        </>
                      }
                      </TableCell>
                      <TableCell align="right">
                        {getTaggedNotes(tag.id)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <DialogComponent/>
        </SetIsClickedContext.Provider>
      </SetSortedTagListContext.Provider>
    </TitleContext.Provider>
  )
}

export default TagManager