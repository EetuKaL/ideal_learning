import React from "react"
import { ListItem } from "../types/types"


interface ListBoxProps {
  list: ListItem[];
  select: (index: number, side: string, isSelected: boolean) => void;
  side: string;
}

 const ListBox: React.FC<ListBoxProps> = ({list, select, side}) => {
    return <div className="list-box-container">
      <h1>{side} list</h1>
    <section className='list-box'>
        {typeof(list) !== 'undefined' && list.length > 0 ? list.map((item: ListItem, index: number) => {
        return  <button style={{
            color: item.selected ? 'green' : 'black'
          }}key={index} className='list-item' onClick={() => select(index, side, !item.selected)
          }>{item.name}</button>
          
        }): <p>No items added yet</p>}        
      </section>
      </div>
    
}

export default ListBox;