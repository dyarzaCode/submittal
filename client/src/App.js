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
  const [formData, setFormData] = useState({ column1: '', column2: '', column3: '', column4: '', lead_time_weeks: '' });
  const [sorting, setSorting] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
    console.log('Sending form data:', formData);
    try {
      await axios.post('http://localhost:5000/api/items', formData);
      // Fetch fresh data to get calculated fields
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
      setFormData({ column1: '', column2: '', column3: '', column4: '', lead_time_weeks: '' });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEdit = (id) => {
    const itemToEdit = items.find(item => item.id === id);
    setEditingId(id);
    setEditData(itemToEdit);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/items/${id}`, editData);
      // Refetch all items to get the updated calculated fields
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
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
    columnHelper.accessor('column1', {
      header: ({ column }) => (
        <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Manufacturer {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 200,
      cell: info => {
        const rowId = info.row.original.id;
        const value = info.getValue();
        return editingId === rowId ? (
          <input
            type="text"
            value={editData.column1 || ''}
            onChange={(e) => setEditData({ ...editData, column1: e.target.value })}
          />
        ) : (
          <div style={{ textAlign: 'left' }}>{value}</div>
        );
      },
    }),
    columnHelper.accessor('column2', {
      header: ({ column }) => (
        <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Type {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 150,
      cell: info => {
        const rowId = info.row.original.id;
        const value = info.getValue();
        return editingId === rowId ? (
          <select
            value={editData.column2 || ''}
            onChange={(e) => setEditData({ ...editData, column2: e.target.value })}
          >
            <option value="">Select a type...</option>
            {categories.map(cat => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        ) : (
          <div style={{ textAlign: 'left' }}>{value}</div>
        );
      },
    }),
    columnHelper.accessor('column3', {
      header: ({ column }) => (
        <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Description {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 300,
      cell: info => {
        const rowId = info.row.original.id;
        const value = info.getValue();
        return editingId === rowId ? (
          <input
            type="text"
            value={editData.column3 || ''}
            onChange={(e) => setEditData({ ...editData, column3: e.target.value })}
          />
        ) : (
          <div style={{ textAlign: 'left' }}>{value}</div>
        );
      },
    }),
    columnHelper.accessor('lead_time_weeks', {
      header: ({ column }) => (
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Lead Time in Weeks {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 150,
      cell: info => {
        const rowId = info.row.original.id;
        const value = info.getValue();
        return editingId === rowId ? (
          <input
            type="number"
            min="0"
            value={editData.lead_time_weeks || ''}
            onChange={(e) => setEditData({ ...editData, lead_time_weeks: e.target.value })}
            style={{ width: '80px' }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            {value || '0'}
          </div>
        );
      },
    }),
    columnHelper.accessor('submit_by_date', {
      header: ({ column }) => (
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Submit by date {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      size: 150,
      cell: info => {
        const date = info.getValue();
        if (!date) return 'No date set';
        try {
          return (
            <div style={{ textAlign: 'center' }}>
              {new Date(date).toLocaleDateString()}
            </div>
          );
        } catch (error) {
          console.error('Error formatting date:', error);
          return 'Invalid date';
        }
      },
    }),
    columnHelper.accessor('column4', {
      header: ({ column }) => (
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={column.getToggleSortingHandler()}>
          Due on site {column.getIsSorted() ? (column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
        </div>
      ),
      cell: info => {
        const rowId = info.row.original.id;
        const value = info.getValue();
        return editingId === rowId ? (
          <input
            type="date"
            value={editData.column4 || ''}
            onChange={(e) => setEditData({ ...editData, column4: e.target.value })}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            {value ? new Date(value).toLocaleDateString() : 'No date set'}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      size: 100,
      cell: info => {
        const rowId = info.row.original.id;
        return editingId === rowId ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleSave(rowId)}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => handleEdit(rowId)}>Edit</button>
        );
      },
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
          value={formData.column1}
          onChange={(e) => setFormData({ ...formData, column1: e.target.value })}
        />
        <select
          value={formData.column2}
          onChange={(e) => setFormData({ ...formData, column2: e.target.value })}
        >
          <option value="">Select a type...</option>
          {categories.map(cat => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Description"
          value={formData.column3}
          onChange={(e) => setFormData({ ...formData, column3: e.target.value })}
        />
        <input
          type="number"
          placeholder="Lead Time (weeks)"
          min="0"
          value={formData.lead_time_weeks}
          onChange={(e) => setFormData({ ...formData, lead_time_weeks: e.target.value })}
        />
        <input
          type="date"
          placeholder="Due on site"
          value={formData.column4}
          onChange={(e) => setFormData({ ...formData, column4: e.target.value })}
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
            {table.getRowModel().rows.map(row => {
              // Get the submit_by_date from the row data
              const submitByDate = row.original.submit_by_date;
              
              // Calculate time differences
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
              const submitDate = submitByDate ? new Date(submitByDate) : null;
              const twoWeeksFromNow = new Date();
              twoWeeksFromNow.setDate(today.getDate() + 14);
              
              // Determine row class
              let rowClass = '';
              if (submitDate) {
                if (submitDate <= today) {
                  rowClass = 'overdue';
                } else if (submitDate <= twoWeeksFromNow) {
                  rowClass = 'urgent';
                }
              }
              
              return (
                <tr key={row.id} className={rowClass}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
