# Accessible Food Delivery App

A full-stack food delivery application built with React, TypeScript, Vite, and Supabase. This app connects local grocery stores with customers and drivers, with a special focus on accessibility for elderly and disabled users.

## Features

### Core Functionality
- **Store Catalogs**: Browse multiple grocery stores (Spar, Choppies, Shoprite, Pick n Pay, etc.)
- **Product Search & Filter**: Search products by category and store
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout & Driver Matching**: Smart driver matching based on GPS location
- **Delivery Fee Bidding**: Customers can adjust delivery fees to attract drivers
- **Real-time Tracking**: Live map showing driver location and route
- **In-app Chat**: Direct messaging between customers and drivers
- **Order Management**: Track order status from pending to delivered

### Accessibility Features
- **Large UI Elements**: Buttons, text, and controls sized for easy interaction
- **High Contrast Design**: Clear visual hierarchy with readable colors
- **Voice Assistant**:
  - Voice commands for navigation and shopping
  - Text-to-speech for menu items and order updates
  - Supports English (extensible to Setswana and other languages)
- **Simple Interface**: Clean, uncluttered design for users with limited mobility

### Voice Commands
Try these voice commands:
- "Find Choppies" - Navigate to store search
- "Add milk and bread" - Search for products
- "Go to checkout" - Navigate to checkout
- "Go to cart" - View shopping cart

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Maps**: Leaflet & React-Leaflet
- **Routing**: React Router v7
- **UI Components**: Headless UI
- **Notifications**: React Hot Toast

## Database Schema

### Tables
- `profiles` - User accounts (customers, drivers, admins)
- `stores` - Grocery store information
- `categories` - Product categories
- `products` - Store inventory
- `orders` - Customer orders with status tracking
- `order_items` - Line items for each order
- `driver_locations` - Real-time driver GPS coordinates
- `delivery_bids` - Driver bids for delivery jobs
- `messages` - In-app chat messages

### Security
- Row Level Security (RLS) enabled on all tables
- Customers can only view/edit their own data
- Drivers can only view assigned orders
- Real-time subscriptions for live updates

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (database already provisioned)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:

Update `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Seed the database (optional):

Run the SQL commands in `seed.sql` to add sample stores and categories.

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/         # Authentication forms
│   ├── cart/         # Shopping cart components
│   ├── chat/         # Messaging interface
│   ├── delivery/     # Delivery tracking
│   ├── map/          # Map components
│   ├── store/        # Store and product cards
│   ├── ui/           # Reusable UI components
│   └── voice/        # Voice assistant
├── pages/
│   ├── Home.tsx      # Store listing
│   ├── StorePage.tsx # Product catalog
│   ├── Cart.tsx      # Shopping cart
│   ├── Checkout.tsx  # Order placement
│   └── Tracking.tsx  # Order tracking
├── hooks/            # Custom React hooks
├── services/         # API and business logic
├── utils/            # Helper functions
├── config/           # Configuration files
└── types/            # TypeScript type definitions
```

## User Roles

### Customer
- Browse stores and products
- Add items to cart
- Place orders with custom delivery fees
- Track deliveries in real-time
- Chat with assigned driver

### Driver
- View available delivery requests
- Place bids on orders
- Update real-time location
- Chat with customers
- Update order status

### Admin
- Manage stores and products
- Monitor all orders
- Manage users

## Workflow Example

1. Customer signs up and logs in
2. Browses Choppies store
3. Adds milk and bread to cart
4. Goes to checkout, enters delivery address
5. Sets delivery fee to P50
6. Places order
7. Driver sees order, accepts it
8. Driver shops and updates status to "shopping"
9. Driver delivers, updates status to "delivering"
10. Customer tracks driver on map in real-time
11. They chat about gate code
12. Order marked as "delivered"

## Accessibility Compliance

This app follows WCAG 2.1 guidelines:
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels on interactive elements
- High contrast ratios (minimum 4.5:1)
- Large touch targets (minimum 44x44px)
- Voice control integration
- Screen reader friendly

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Payment integration (Stripe/Paystack)
- [ ] SMS notifications
- [ ] Driver earnings dashboard
- [ ] Customer order history
- [ ] Product reviews and ratings
- [ ] Store promotions and specials
- [ ] Multi-language support (Setswana, etc.)
- [ ] Push notifications
- [ ] Advanced analytics dashboard

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please open an issue on the repository.
