import React, { useContext } from 'react'
import { Container, Paper, Grid, Box } from '@mui/material'
import { TextField as MUITextField} from '@mui/material'
import { styled } from '@mui/material/styles'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import uuid from 'react-uuid'
import { ActiveNoteContext, ListWidthContext, SetSortedNotesContext } from './NoteBrowser'
import TagRegistor from './TagRegistor';
import { NoteContext, NotebookIdContext } from '../App';

const TextField = styled(MUITextField)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}))

const NoteEditor: React.FC = () => {
  const listWidth = useContext(ListWidthContext)
  const { setSortedNotes } = useContext(SetSortedNotesContext)
  const { notes } = useContext(NoteContext)
  const { activeNote, setActiveNote } = useContext(ActiveNoteContext)
  const { activeNotebookId } = useContext(NotebookIdContext)

  const onAddNote = () => {
    const newNote = { 
      id: uuid(),
      title: '',
      content: '',
      tag: [],
      modDate: Date.now(),
      notebookid: activeNotebookId
    }
    setSortedNotes([...notes, newNote])
  }

  return (
    <Box 
      component='main' 
      sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      width: `calc(100% - ${listWidth}px)`, 
      mt:9,
      }}>
      <Container sx={{ p: 3, }}>
        <Paper sx={{ p: 3 }}>
          <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField 
            id="title" 
            label="タイトル" 
            variant="standard"
            placeholder='新しいノート'
            value={activeNote.title}
            onChange={(e) => setActiveNote({
              ...activeNote,
              "title": e.target.value,
              modDate: Date.now()
            })}
            />
            <TextField
              id="content"
              label="説明"
              multiline
              rows={10}
              value={activeNote.content}
              variant="standard"
              onChange={(e) => setActiveNote({
                ...activeNote,
                "content": e.target.value,
                modDate: Date.now()
              })}
            />
            <TagRegistor/>
          </Grid>
          <Fab 
          color="secondary" 
          aria-label="add" 
          sx={{ position: 'absolute', bottom: 100, right: 100 }}>
            <AddIcon onClick={onAddNote}/>
          </Fab>
        </Paper>
      </Container>
    </Box>
  )
}

export default NoteEditor