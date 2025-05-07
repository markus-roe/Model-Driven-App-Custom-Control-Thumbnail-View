# Model-Driven App Custom Grid Control

A custom grid control for Model-Driven Apps that provides a modern, responsive grid view with pagination, sorting, and filtering capabilities.

## Features

- Responsive grid layout
- Pagination with first/previous/next navigation
- Column sorting (A-Z, Z-A)
- Column filtering
- Image thumbnail support
- Row selection
- Custom row styling based on data
- Loading state handling

## Usage

1. Import the control into your Model-Driven App solution
2. Add the control to your form or view
3. Configure the columns and data source

## Configuration

The grid supports the following features:

- **Pagination**: Navigate through pages of data
- **Sorting**: Click column headers to sort
- **Filtering**: Right-click column headers to filter
- **Selection**: Click rows to select them
- **Navigation**: Click on cells to navigate to the record

## Development

### Prerequisites

- Node.js
- npm
- Power Platform CLI

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the solution:
   ```bash
   npm run build
   ```

### Debugging

The control includes minimal logging for essential operations:

- `[GRID] Version X.X.X initializing...` - Control initialization
- `[GRID] Loading next/previous/first page` - Pagination events

## Version History

- 1.0.4: Simplified loading state handling
- 1.0.3: Aggressive loading state fix
- 1.0.2: Loading state fix
- 1.0.1: Initial version

## License

This project is licensed under the MIT License - see the LICENSE file for details. 