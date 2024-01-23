import React, { useState } from 'react';

const DragDropExample = () => {
  const [draggedItem, setDraggedItem] = useState(null);

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

    console.log('dropped item:', droppedItem);

    setDraggedItem(null);
  };

  return (
    <div>
      <h2>Drag and Drop example</h2>
      <div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, { id: 1, content: 'moved item' })}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            padding: '8px',
            margin: '8px',
            border: '1px solid #ddd',
            backgroundColor: draggedItem ? 'lightblue' : 'white',
            cursor: 'move',
          }}
        >
          moveable item
        </div>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            padding: '8px',
            margin: '8px',
            border: '1px solid #ddd',
            backgroundColor: draggedItem ? 'lightyellow' : 'white',
          }}
        >
          drop area
        </div>
      </div>
    </div>
  );
};

export default DragDropExample;
