import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, CssBaseline } from '@mui/material';
import TopPage from './components/TopPage';
import NoteBrowser from './components/NoteBrowser';
import TagsManager from './components/TagsManager';
import Header from './components/Header';
import { DialogModeType, NoteType, TagType, defaultDialogMode, defaultNote } from './Object.d';
// コンテキストの作成
export const NotebookIdContext = createContext<{ 
  activeNotebookId: string, 
  setActiveNotebookId: (activeNotebookId: string) => void 
}>({
  activeNotebookId: '',
  setActiveNotebookId: () => {},
});

export const TagListContext = createContext<{ 
  tagList: TagType[], 
  setTagList: (tagList: TagType[]) => void 
}>({
  tagList: [],
  setTagList: () => {},
});

export const NoteContext = createContext<{ 
  notes: NoteType[], 
  setNotes: (notes: NoteType[]) => void 
}>({
  notes: [defaultNote],
  setNotes: () => {},
});

export const DialogModeContext = createContext<{
  dialogMode: DialogModeType,
  setDialogMode: (dialogMode: DialogModeType) => void
}>({
  dialogMode: defaultDialogMode,
  setDialogMode: () => {},
})

export const OpenDialogContext = createContext<{ 
  openDialog: boolean, 
  setOpenDialog: (openDialog: boolean) => void 
}>({
  openDialog: false,
  setOpenDialog: () => {},
});

const App: React.FC = () => {
  const [activeNotebookId, setActiveNotebookId] = useState<string>(localStorage.getItem("activeNotebookId") as string)
  const [tagList, setTagList] = useState<TagType[]>(JSON.parse(localStorage.getItem("tags") as string) || [])
  const [notes, setNotes] = useState<NoteType[]>(JSON.parse(localStorage.getItem("notes") as string) || []) //noteの取得・更新
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<DialogModeType>(defaultDialogMode)

  useEffect(() => {
    localStorage.setItem("activeNotebookId", activeNotebookId)
  },[activeNotebookId])

  // tagListが更新されたらlocalStraeに保存する
  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tagList))
  },[tagList])

  return (
    <NotebookIdContext.Provider value={{activeNotebookId, setActiveNotebookId}}>
      <TagListContext.Provider value={{tagList, setTagList}}>
        <NoteContext.Provider value={{ notes, setNotes }}>
          <DialogModeContext.Provider value={{dialogMode, setDialogMode}}>
            <OpenDialogContext.Provider value={{openDialog, setOpenDialog}}>
              <Box sx={{ display: 'flex', bgcolor: 'grey.50' }}>
                <CssBaseline />
                <Router>
                  <Header />
                  <Container>
                    <Routes>
                      <Route path="/" element={<TopPage />} />
                      <Route path="/note" element={<NoteBrowser />}/>
                      <Route path="/tag" element={<TagsManager />} />
                    </Routes>
                  </Container>
                </Router>
              </Box>
            </OpenDialogContext.Provider>
          </DialogModeContext.Provider>
        </NoteContext.Provider>
      </TagListContext.Provider>
    </NotebookIdContext.Provider>
  )
}

export default App
