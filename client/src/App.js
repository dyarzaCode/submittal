import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel
} from '@tanstack/react-table';

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ field1: '', field2: '', field3: '' });
  const [sorting, setSorting] = useState([]);

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

  // Define columns using the column helper
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('id', {
      header: ({ column }) => (
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          ID {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 50,
      cell: info => (
        <div style={{ textAlign: 'center' }}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('field1', {
      header: ({ column }) => (
        <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Manufacturer {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 200,
      cell: info => (
        <div style={{ textAlign: 'left' }}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('field2', {
      header: ({ column }) => (
        <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Type {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 150,
      cell: info => (
        <div style={{ textAlign: 'left' }}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('field3', {
      header: ({ column }) => (
        <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Description {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 300,
      cell: info => (
        <div style={{ textAlign: 'left' }}>
          {info.getValue()}
        </div>
      ),
    }),
  ];

  const [columnResizing, setColumnResizing] = useState({});

  // Set up the table instance
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    state: {
      columnResizing,
      sorting,
    },
    onColumnResizingChange: setColumnResizing,
    onSortingChange: setSorting,
  });

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
          placeholder="Manufacturer"
          value={formData.field1}
          onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type"
          value={formData.field2}
          onChange={(e) => setFormData({ ...formData, field2: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.field3}
          onChange={(e) => setFormData({ ...formData, field3: e.target.value })}
        />
        <button type="submit">Add Item</button>
      </form>

      <h2>Database Entries</h2>
      <div className="table-container">
        <table style={{ width: table.getTotalSize() }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: 'relative',
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className="resizer"
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
