export type ListItem = {
    id: string;
    name: string;
    selected: boolean;
  };
  
  export type ListState = {
    leftList: ListItem[];
    rightList: ListItem[];
    itemIsSelected_left: boolean;
    itemIsSelected_right: boolean;
    addNameInput: string;
    searchNameInput: string;
    filteredLeftList: ListItem[];
    filteredRightList: ListItem[];
  };

  export enum Side {
    Left,
    Right
  }

  export enum Keys {
    Left = 'leftList',
    Right = 'rightList',
    FilteredLeft = 'filteredLeftList',
    FilteredRight = 'filteredRightList'
  }
  