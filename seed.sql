-- Sample data for testing the food delivery app

-- Insert categories
INSERT INTO categories (name, description, icon, sort_order) VALUES
  ('Dairy', 'Milk, cheese, yogurt and dairy products', '🥛', 1),
  ('Bakery', 'Bread, cakes, and baked goods', '🍞', 2),
  ('Meat & Poultry', 'Fresh meat, chicken, and sausages', '🥩', 3),
  ('Fruits & Vegetables', 'Fresh produce', '🥬', 4),
  ('Beverages', 'Drinks and refreshments', '🥤', 5),
  ('Pantry', 'Rice, pasta, canned goods', '🍝', 6)
ON CONFLICT DO NOTHING;

-- Insert stores (Botswana grocery stores)
INSERT INTO stores (name, description, address, latitude, longitude, phone, is_active) VALUES
  ('Choppies', 'Leading supermarket chain in Botswana', 'Main Mall, Gaborone', -24.6549, 25.9087, '+267 123 4567', true),
  ('Spar', 'Quality groceries and household items', 'Fairgrounds, Gaborone', -24.6282, 25.9231, '+267 234 5678', true),
  ('Shoprite', 'Wide range of affordable groceries', 'Game City, Gaborone', -24.6770, 25.9088, '+267 345 6789', true),
  ('Pick n Pay', 'Fresh food and quality products', 'Riverwalk Mall, Gaborone', -24.6584, 25.9212, '+267 456 7890', true)
ON CONFLICT DO NOTHING;

-- Note: To add products, you'll need to get the actual store_id and category_id from the database
-- This is just a template showing the structure
