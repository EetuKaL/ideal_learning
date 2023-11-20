


export default function ListBox ({list, select, side}) {
  
    return <div className="list-box-container">
      <h1>{side} list</h1>
    <section className='list-box'>
        {typeof(list) !== 'undefined' && list.length > 0 ? list.map((item, index) => {
        return  <button style={{
            color: item.selected ? 'green' : 'black'
          }}key={index} className='list-item' onClick={() => select(index, side, !item.selected)
          }>{item.name}</button>
          
        }): <p>No items added yet</p>}        
      </section>
      </div>
    
}