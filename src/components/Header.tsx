import { useState, createContext, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import DrawerList from './DrawerList';
import { NotebookType, defaultNotebook, } from '../Object.d';

const drawerWidth = 400;

export const OpenDrawerContext = createContext<{ 
  openDrawer: boolean, 
  setOpenDrawer: (openDrawer: boolean) => void 
}>({
  openDrawer: false,
  setOpenDrawer: () => {},
});

export const NotebooksContext = createContext<{ 
  notebooks: NotebookType[], 
  setNotebooks: (notebooks: NotebookType[]) => void 
}>({
  notebooks: [defaultNotebook],
  setNotebooks: () => {},
});

const Header: React.FC = () => {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  // localStrageからnotebooksを取得
  const [notebooks, setNotebooks] = useState<NotebookType[]>(JSON.parse(localStorage.getItem("Notebooks") || "null") || [])
  
  // notebooksを変更したらlocalStorageに登録
  useEffect(() => {
    localStorage.setItem("Notebooks", JSON.stringify(notebooks))
  },[notebooks])
  
  return (
    <>
    <OpenDrawerContext.Provider value={{openDrawer, setOpenDrawer}}>
    <NotebooksContext.Provider value={{notebooks, setNotebooks}}>
      <AppBar 
      position="fixed" 
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenDrawer(true)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            MOKO NOTE
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
        anchor="left"
        open={openDrawer}
      >
        <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          px: 1,
          m: 1,
         }}>
          <IconButton onClick={() => setOpenDrawer(false)}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
        <Divider />
        <Box 
        sx={{ width: drawerWidth }}
        role="presentation"
        >
          <DrawerList/>
        </Box>
      </Drawer>
      </NotebooksContext.Provider>
      </OpenDrawerContext.Provider>
    </>
  )
}

export default Header