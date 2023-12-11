import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { TagType } from '../Object.d';
import uuid from 'react-uuid';
import { ActiveNoteContext } from './NoteBrowser';
import { TagListContext } from '../App';

const filter = createFilterOptions<TagType>();

const TagRegistor: React.FC = () => {
  const { activeNote, setActiveNote } = useContext(ActiveNoteContext)
  const [value, setValue] = useState<TagType[]>([]);
  const { tagList, setTagList } = useContext(TagListContext)

  const selectedIds = (tags: TagType[]) => {
    const selectedIdList: string[] = []
    for (const tag of tags) {
      if (typeof tag.id !== 'undefined') {
        selectedIdList.push(tag.id)
      }
    }
    return selectedIdList
  }

  const selectedTags = (ids: string[]) => {
    const selectedTagList: TagType[] = []
    for (const id of ids) {
      for (const tag of tagList) {
        if (tag.id === id) {
          selectedTagList.push(tag)
        }
      }
    }
    return selectedTagList
  }

  // activeNoteが切り替わったら、そのノートのタグを読み込む
  useEffect(() => {
    const tags = selectedTags(activeNote.tag)
    setValue(tags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNote])

  const handleRegist = (tags: (TagType | string)[]) => { 
    // 新規作成したタグにidを振り、inputValueを空にする
    const newTags: TagType[] = []
    for (const tag of tags) {
      if (typeof tag === 'string') {
        const newTag: TagType = {
          id: uuid(),
          title: tag
        }
        newTags.push(newTag)
        // タグをデータベースに登録
        setTagList([
          ...tagList,
          newTag
        ])
      }
      else if (tag.inputValue) {
        const newTag: TagType = {
          id: uuid(),
          title: tag.inputValue
        }
        newTags.push(newTag)
        // タグをデータベースに登録
        setTagList([
          ...tagList,
          newTag
        ])
      }
      else {
        newTags.push(tag)
      }
    }
    //console.log("newTags", newTags)
    setValue(newTags)
    // activeNoteのタグを更新
    setActiveNote({
      ...activeNote,
      tag: selectedIds(newTags),
      modDate: Date.now()
    })
  };

  return (
    <Autocomplete
        value={value}
        onChange={(_event, newValue) => {
          console.log("newValue", newValue)
          if (newValue) {
            handleRegist(newValue)
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== '') {
            filtered.push({
              id: "",
              inputValue: params.inputValue,
              title: `"${params.inputValue}"を新規作成`,
            });
          }
          return filtered;
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          } else if (option.inputValue) {
            return option.inputValue
          } else {
            return option.title
          }
        }}
        multiple
        limitTags={2}
        id="free-solo-dialog-demo"
        options={tagList}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        sx={{ width: 500 }}
        freeSolo
        renderInput={(params) => <TextField {...params} label="タグを選択または新規作成" />}
      />
  )
}

export default TagRegistor