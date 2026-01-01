# Product Management CRUD Application

A modern, production-ready CRUD application built with React, TypeScript, and Tailwind CSS. Features real-time updates, form validation, and beautiful UI components.

## Features

### Core CRUD Operations
- **Create**: Add new products with comprehensive form validation
- **Read**: View all products in a beautiful, searchable table
- **Update**: Edit existing products with pre-filled forms
- **Delete**: Remove products with confirmation dialogs

### Advanced Features

#### Form Validation
- Built with `react-hook-form` and `zod` for robust validation
- Real-time error messages
- Field-level validation rules:
  - Title: 3-100 characters
  - Description: minimum 10 characters
  - Price: must be greater than 0
  - Discount: 0-100%
  - Rating: 0-5 stars
  - Stock: non-negative integers
  - Brand: minimum 2 characters
  - Category: required selection

#### Reusable Form Components
- `Input`: Text/number input with labels and error states
- `Select`: Dropdown with dynamic options
- `TextArea`: Multi-line text input
- All components support forwarding refs and validation

#### Modal-based Forms
- Clean overlay modals with backdrop blur
- Keyboard support (Esc to close)
- Smooth animations
- Prevents body scroll when open
- Responsive design

#### Optimistic UI Updates
- Immediate UI feedback before API response
- Automatic rollback on error
- Smooth user experience with no loading delays for UI updates

#### API Error Handling
- Comprehensive error catching
- User-friendly error messages
- Automatic retry options
- Toast notifications for all operations

#### SweetAlert2 Confirmation Dialogs
- Beautiful confirmation modals for delete operations
- Custom styling matching the app theme
- Shows product details before deletion
- Success/error notifications with auto-dismiss

#### Search Functionality
- Real-time search across:
  - Product titles
  - Brands
  - Categories
- Instant filtering with no API calls

#### Loading States
- Spinner during initial data load
- Disabled form inputs during submission
- Loading indicators on buttons

## Tech Stack

- **React 19.2.0**: Latest React with hooks
- **TypeScript 5.9**: Type-safe code
- **Tailwind CSS 4.1**: Modern utility-first styling
- **Vite**: Fast build tool with Rolldown
- **React Hook Form**: Performant form management
- **Zod**: Schema validation
- **SweetAlert2**: Beautiful modals and alerts
- **DummyJSON API**: Realistic fake data

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173 to view the app.

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── form/
│   │   ├── Input.tsx          # Reusable input component
│   │   ├── Select.tsx         # Reusable select component
│   │   └── TextArea.tsx       # Reusable textarea component
│   ├── Modal.tsx              # Modal wrapper component
│   ├── ProductForm.tsx        # Product create/edit form
│   └── ProductList.tsx        # Product table with search
├── services/
│   └── productService.ts      # API service layer
├── types/
│   └── product.ts             # TypeScript interfaces
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

## License

MIT
