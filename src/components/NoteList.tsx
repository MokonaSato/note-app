import React, { useContext, useState, useEffect } from 'react'
import { Drawer, Button, Grid,ListItemButton, List, Typography } from '@mui/material'
import { ActiveNoteContext, ListWidthContext, SelectedIndexContext, SetSortedNotesContext } from './NoteBrowser'
import { NoteType, defaultNote } from '../Object.d'
import { NoteContext, NotebookIdContext } from '../App'

const NoteList: React.FC = () => {
  const listWidth = useContext(ListWidthContext)
  const { setSortedNotes } = useContext(SetSortedNotesContext)
  const { notes } = useContext(NoteContext)
  const { selectedIndex, setSelectedIndex } = useContext(SelectedIndexContext)
  const { setActiveNote } = useContext(ActiveNoteContext)
  const { activeNotebookId } = useContext(NotebookIdContext)
  const [ previewNotes, setPreviewNotes ] = useState<NoteType[]>([])

  useEffect (() => {
    const filterNotes = notes.filter((note) => note.notebookid === activeNotebookId)
    setPreviewNotes(filterNotes)
    setActiveNote(filterNotes.slice(0, 1)[0])
  },[notes, activeNotebookId, setActiveNote])

  const onDeleteNote = (id: string) => {
    const filterNotes = notes.filter((note) => note.id !== id)
    setSortedNotes(filterNotes)
  }

  const handleListItemClick = (index:string): void => {
    // console.log("click!!")
    setSelectedIndex(index);
    // console.log("selectedIndex", index)
    setActiveNote(notes.find((note) => note.id === index) ?? defaultNote)
  };

  return (
    <Drawer 
        sx={{
        width: listWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: listWidth,
          boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
        >
        <List component="nav" sx={{ mt:9 }}>
          {previewNotes.map((note) => {
            return (
              <ListItemButton 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
               
              selected={selectedIndex === note.id}
              onClick={() => handleListItemClick(note.id)}
              key={note.id}
              >
                <Grid container sx={{display: 'flex', justifyContent: 'space-between'}}>
                  <Grid item>
                    <Typography 
                      component='span' 
                      variant='h6' 
                      color='text.primary'
                      sx={{ fontWeight: 'bold' }}>
                        {note.title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography 
                      variant='body2' 
                      component='span' 
                      color='text.secondary'>
                      {new Date(note.modDate).toLocaleDateString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button onClick={() => onDeleteNote(note.id)}>削除</Button>
                  </Grid>
                </Grid>
                <Typography 
                  variant='body1' 
                  color='text.primary' 
                  component='h2'
                  paragraph
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}>
                    {note.content}
                </Typography>
            </ListItemButton>
            )
          })}
        </List>
      </Drawer>
  )
}

export default NoteList