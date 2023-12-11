import React from 'react'
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import NotebookIcon from '@mui/icons-material/LibraryBooks'
import AddIcon from '@mui/icons-material/Add'
import TagIcon from '@mui/icons-material/LocalOffer'
import TestIcon from '@mui/icons-material/Quiz'
import IconButton from '@mui/material/IconButton';
import { DialogModeContext, NotebookIdContext, OpenDialogContext } from '../App'
import { NotebooksContext, OpenDrawerContext } from './Header';
import DialogComponent from './DialogComponent';
import { NotebookType, defaultNotebook } from '../Object.d';

const DrawerList: React.FC = () => {
  const { setActiveNotebookId } = useContext(NotebookIdContext)
  const { setOpenDrawer } = useContext(OpenDrawerContext)
  const { notebooks } = useContext(NotebooksContext)
  const [openToggle, setOpenToggle] = useState<boolean>(true)
  const { setDialogMode } = useContext(DialogModeContext)
  const { setOpenDialog } = useContext(OpenDialogContext)
  

  const handleBrowseNote = (id: string): void => {
    setOpenDrawer(false)
    setActiveNotebookId(id)
  }

  const handlerOpenDialog = (mode: string, object: NotebookType) => {
    setDialogMode({mode, object})
    setOpenDialog(true)
  }

  return (
    <>
    <List>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/" onClick={() => setOpenDrawer(false)}>
          <ListItemIcon>
            <HomeIcon/>
          </ListItemIcon>
          <ListItemText primary='HOME' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpenToggle(!openToggle)}>
          <ListItemIcon>
            <NotebookIcon/>
          </ListItemIcon>
          <ListItemText primary='NOTEBOOK' />
          {openToggle ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={openToggle} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handlerOpenDialog("newNotebook", defaultNotebook)}>
              <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                <AddIcon/>
              </ListItemIcon>
              <ListItemText primary="新しいノートブックを作成" />
            </ListItemButton>      
          {notebooks.length > 0 && notebooks.map((notebook) => {
          return(
              <ListItem 
                secondaryAction={
                  <>
                  <IconButton
                    id="rename-button"
                    sx={{ minWidth: 0 }}
                    onClick={() => handlerOpenDialog("renameNotebook", notebook)}
                  >
                    <EditIcon/>
                  </IconButton>
                  <IconButton
                    id="delete-button"
                    sx={{ minWidth: 0 }}
                    onClick={() => handlerOpenDialog("deleteNotebook", notebook)}
                  >
                    <DeleteIcon/>
                  </IconButton>
                  </>
                }
                key={notebook.id}
                disablePadding
              >
                <ListItemButton 
                component={Link} to="/note"
                sx={{ pl: 8 }} 
                onClick={() => handleBrowseNote(notebook.id)}
                >
                  <ListItemText primary={notebook.title} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Collapse>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/tag" onClick={() => setOpenDrawer(false)}>
          <ListItemIcon>
            <TagIcon/>
          </ListItemIcon>
          <ListItemText primary='TAGS' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/test">
          <ListItemIcon>
            <TestIcon/>
          </ListItemIcon>
          <ListItemText primary='TEST' />
        </ListItemButton>
      </ListItem>
    </List>
    <DialogComponent/>
    </>
  )
}

export default DrawerList