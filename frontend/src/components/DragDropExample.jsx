import React, { useState } from 'react';

const DragDropExample = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropAreaItems, setDropAreaItems] = useState([]);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedItem = JSON.parse(e.dataTransfer.getData('text/plain'));

    const newDropAreaItem = { id: Date.now(), content: droppedItem.content + ' - New' };

    setDropAreaItems((prevItems) => [...prevItems, newDropAreaItem]);

    setDraggedItem(null);
  };

  return (
    <div>
      <h2>Drag and Drop example</h2>
      <div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, { id: 1, content: 'dragged item' })}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            padding: '8px',
            margin: '8px',
            border: '1px solid #ddd',
            backgroundColor: draggedItem ? 'black' : 'black',
            cursor: 'move',
          }}
        >
          dropable item
        </div>
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: '500px',
          height: '500px',
          padding: '8px',
          margin: '8px',
          border: '1px solid #ddd',
          backgroundColor: draggedItem ? 'red' : 'white',
          color:"black"
        }}
      >
        {dropAreaItems.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
        dropped area
      </div>
    </div>
  );
};

export default DragDropExample;
