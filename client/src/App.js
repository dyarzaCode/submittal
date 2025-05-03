import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { createColumnHelper, useReactTable, getCoreRowModel } from '@tanstack/react-table';

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('');
  const [formData, setFormData] = useState({ field1: '', field2: '', field3: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/items', formData);
      setItems([...items, response.data]);
      setFormData({ field1: '', field2: '', field3: '' });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (field) => {
    setSortField(field);
    const sortedItems = [...items].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
    setItems(sortedItems);
  };

  const filteredItems = items.filter(
    (item) =>
      item.field1.toLowerCase().includes(search.toLowerCase()) ||
      item.field2.toLowerCase().includes(search.toLowerCase()) ||
      item.field3.toLowerCase().includes(search.toLowerCase())
  );

  // Define columns using the column helper
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor('field1', {
      header: 'Field 1',
    }),
    columnHelper.accessor('field2', {
      header: 'Field 2',
    }),
    columnHelper.accessor('field3', {
      header: 'Field 3',
    }),
  ];

  // Set up the table instance
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  // Add resizable column functionality
  const ResizableHeader = ({ header }) => {
    const [width, setWidth] = useState(150); // Default column width

    const handleMouseDown = (e) => {
      const startX = e.clientX;
      const startWidth = width;

      const handleMouseMove = (e) => {
        const newWidth = startWidth + (e.clientX - startX);
        setWidth(newWidth > 50 ? newWidth : 50); // Minimum width of 50px
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    return (
      <div
        style={{ width: `${width}px`, display: 'inline-block', position: 'relative' }}
      >
        {header.column.columnDef.header}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            cursor: 'col-resize',
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Item List</h1>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />

      <h2>Add New Item</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Field 1"
          value={formData.field1}
          onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
        />
        <input
          type="text"
          placeholder="Field 2"
          value={formData.field2}
          onChange={(e) => setFormData({ ...formData, field2: e.target.value })}
        />
        <input
          type="text"
          placeholder="Field 3"
          value={formData.field3}
          onChange={(e) => setFormData({ ...formData, field3: e.target.value })}
        />
        <button type="submit">Add Item</button>
      </form>

      <h2>Database Entries</h2>
      <table>
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <ResizableHeader header={header} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.column.columnDef.cell(cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
