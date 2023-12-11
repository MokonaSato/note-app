export type NotebookType = {
  id: string,
  title: string
}

export const defaultNotebook: NotebookType = {
  id: '',
  title: '',
}

export type NoteType = {
  id: string, 
  title: string, 
  content: string, 
  tag: string[],
  modDate: number,
  notebookid: string
}

export const defaultNote: NoteType = {
  id: '', 
  title: '', 
  content: '', 
  tag: [],
  modDate: 0,
}

export interface TagType {
  inputValue?: string;
  id?: string;
  title: string;
}

export const defaultTag: TagType = {
   id: '', title: '' 
  };

export type DialogModeType = {
  mode: string,
  object: NotebookType | TagType | null
}

export const defaultDialogMode: DialogModeType = {
  mode: "",
  notebook: defaultNotebook,
}

export type DialogContentType = {
  title: string,
  message: string,
  needForm: boolean,
}

export const defaultDialogContent = {
  title: "",
  message: "",
  needForm: false
}

export const isNotebook = (object: NotebookType | TagType | null ): object is NotebookType => {
  // Weapon型に強制キャストしてatackプロパティがあればWeapon型とする
  return !!(object as NotebookType)?.id
}

export const isTag = (object: NotebookType | TagType | null ): object is TagType => {
  // Weapon型に強制キャストしてatackプロパティがあればWeapon型とする
  return !!(object as TagType)?.id
}