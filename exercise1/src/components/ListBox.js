
export default function ListBox ({list, dispatch, side}) {
    console.log(list)  

      console.log(list)
    return <div className="list-box-container">
      <h1>{side} list</h1>
    <section className='list-box'>
        {typeof(list) !== 'undefined' && list.length > 0 ? list.map((item, index) => {
        return  <button style={{
            color: item.selected ? 'green' : 'black'
          }}key={index} className='list-item' onClick={() => dispatch({type:'select_item', index: index, side:side})
          }>{item.name}</button>
          
        }): <p>No items added yet</p>}        
      </section>
      </div>
    
}