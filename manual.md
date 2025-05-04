# Item List Application Manual

## Overview
This application is a web-based item management system that allows users to view, add, search, and sort items in a database. The interface includes a searchable, sortable table with resizable columns.

## Main Components

### Search Functionality
- Located at the top of the page
- Allows users to filter items by typing in any text
- Search works across all fields (manufacturer, type, and description)
- Updates results in real-time as you type

### Add New Item Form
- Contains three input fields:
  1. Manufacturer: For entering the item's manufacturer
  2. Type: For specifying the item's type
  3. Description: For adding a detailed description
- Includes an "Add Item" button that saves the entry to the database
- Form clears automatically after successful submission

### Database Entries Table
- Displays all items in the database
- Features:
  - Resizable Columns: Users can drag the column edges to adjust their width
  - Sortable Headers: Click on column headers to sort items
  - Four Columns:
    1. ID (automatically assigned)
    2. Field 1 (Manufacturer)
    3. Field 2 (Type)
    4. Field 3 (Description)

## Technical Features

### Data Management
- Automatically loads existing items when the page opens
- Updates in real-time when new items are added
- Maintains connection with a backend server running on localhost:5000

### Table Features
- Minimum column width of 50 pixels
- Default column width of 150 pixels
- Smooth column resizing using mouse drag
- Persistent data storage in a database

### Search and Sort Capabilities
- Case-insensitive search across all fields
- Instant filtering as you type
- Sort functionality available for all columns
- Maintains original data while filtering

## Error Handling
- Displays error messages in the console if:
  - Database connection fails
  - Item addition fails
  - Data fetching encounters problems