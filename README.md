# Silekta - Management Information System

A comprehensive business management system built with Next.js, TypeScript, and Tailwind CSS. Silekta provides tools for managing inventory, suppliers, purchases, orders, and more in a modern, responsive interface.

## Features

### 🎯 Dashboard
- Real-time business metrics and KPIs
- Recent activity tracking
- Quick action buttons for common tasks
- Responsive analytics cards

### 📦 Inventory Management
- Real-time stock level monitoring
- Low stock alerts
- Category-based filtering (Printing & Production materials)
- Advanced search functionality
- Stock status indicators

### 🏢 Supplier & Purchase Management
- Comprehensive supplier database (China, India, Sri Lanka only)
- Interactive modal dialogs for adding suppliers and creating purchase orders
- Purchase order tracking with automatic inventory integration
- Supplier performance ratings with visual star system
- Delivery time analytics
- Multi-status purchase tracking (Delivered, In Transit, Processing, Pending)
- One-click purchase delivery marking with inventory auto-addition
- Responsive design for mobile and desktop

### 🎨 Design System
- Consistent color palette with primary teal theme (`#0B5351`)
- Responsive design for all screen sizes
- Intuitive navigation with visual feedback
- Modern card-based layouts
- Interactive hover states and transitions

## Tech Stack

- **Framework:** Next.js 15.5.4 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Font:** Geist (Sans & Mono)
- **Icons:** Emoji-based icon system
- **Build Tool:** Turbopack for fast development

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MIS-Silekta/silekta-frontend.git
cd silekta-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── inventory/         # Inventory management
│   │   └── page.tsx
│   └── suppliers/         # Supplier & purchase management
│       └── page.tsx
├── components/            # Reusable components
│   └── Navbar.tsx        # Main navigation component
└── public/               # Static assets
    └── Logo (2).png      # Silekta logo
```

## Pages Overview

### Dashboard (`/`)
- Business overview with key metrics
- Recent activities feed
- Quick action buttons
- Performance indicators

### Inventory Management (`/inventory`)
- Stock level monitoring
- Category filtering (Printing/Production materials)
- Search and filter capabilities
- Low stock alerts
- Recently refilled items tracking

### Supplier & Purchase Management (`/suppliers`)
- Supplier database with ratings
- Purchase order tracking
- Delivery time analytics
- Multi-filter search (Country, Rating, Status)
- Recent purchases overview

## Color Palette

- **Primary:** `#0B5351` (Dark Teal)
- **Secondary:** `#8CBCB9` (Light Teal)
- **Accent:** `#80DED9` (Cyan)
- **Alert:** `#DE8080` (Coral)
- **Background:** `#F9FAFB` (Light Gray)

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Pages

1. Create a new directory in `src/app/`
2. Add a `page.tsx` file with your component
3. Update the navigation in `src/components/Navbar.tsx`
4. Follow the existing design patterns and styling

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the established color palette
- Maintain consistent spacing and typography
- Use hover states and transitions for interactive elements
- Ensure responsive design for all components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the MIS-Silekta organization. All rights reserved.
