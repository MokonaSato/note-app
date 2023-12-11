//import React from 'react'
import { useState, useEffect, createContext, useContext } from 'react'
import { Box } from '@mui/material'
import { NoteType, defaultNote } from '../Object.d';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import { NoteContext, NotebookIdContext } from '../App';

const listWidth: number = 300;

export const SelectedIndexContext = createContext<{ 
  selectedIndex: string, 
  setSelectedIndex: (notes: string) => void 
}>({
  selectedIndex: '',
  setSelectedIndex: () => {},
});

export const ActiveNoteContext = createContext<{ 
  activeNote: NoteType, 
  setActiveNote: (notes: NoteType) => void 
}>({
  activeNote: defaultNote,
  setActiveNote: () => {},
});

type SetSortedNotesType ={
  setSortedNotes: (notes: NoteType[]) => void
}

export const SetSortedNotesContext = createContext<SetSortedNotesType>({setSortedNotes: () => {}})

export const ListWidthContext = createContext<number>(0)

const NoteBrowser: React.FC = () => {
  const { activeNotebookId } = useContext(NotebookIdContext)
  const { notes, setNotes } = useContext(NoteContext)
  const [selectedIndex, setSelectedIndex] = useState<string>("");
  const [activeNote, setActiveNote] = useState<NoteType>(defaultNote);


  const setSortedNotes = (notes: NoteType[]) => {
    if (notes.length > 1) {
      const newNotes = notes.sort((n1, n2) => n2.modDate - n1.modDate)
      setNotes(newNotes)
    } else {
      return setNotes(notes);
    }
  }

  // noteを更新したら、localStrageに登録
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))  
  }, [notes])

  useEffect(() => {
    setActiveNote(notes.slice(0, 1)[0])
    setSelectedIndex(notes.slice(0, 1)[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // activeNotebookIdを変更したら、localStorageに登録
  useEffect(() => {
    setSortedNotes(JSON.parse(localStorage.getItem("notes") as string))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeNotebookId])

  useEffect(() => {
    onUpdateNote(activeNote) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNote])

  const onUpdateNote = (updatedNote: NoteType): void => {
    const updateNoteArray = notes.map((note: NoteType) => {
      if (note.id === updatedNote.id) {
        return updatedNote
      } else {
        return note
      }
    })
    setSortedNotes(updateNoteArray)
  }

  return (
      <SelectedIndexContext.Provider value={{ selectedIndex, setSelectedIndex }}>
        <ActiveNoteContext.Provider value={{ activeNote, setActiveNote }}>
          <ListWidthContext.Provider value={listWidth}>
            <SetSortedNotesContext.Provider value={{setSortedNotes}}>
              <Box sx={{ display: 'flex', bgcolor: 'grey.50', }}>
                <NoteList/>
                <NoteEditor/>
              </Box>
            </SetSortedNotesContext.Provider>
          </ListWidthContext.Provider>
        </ActiveNoteContext.Provider>
      </SelectedIndexContext.Provider>
  )
}

export default NoteBrowser