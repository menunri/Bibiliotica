-- ============================================
-- BIBLIOTICA - Supabase Migration Script
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- ============================================
-- SECTION 1: TABLES
-- ============================================

-- Users table (mirrors original 'users' table)
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mobile_number VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table (mirrors original 'admins' table)
CREATE TABLE IF NOT EXISTS admins (
  admin_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table (mirrors original 'library_books' table)
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  published_year INT,
  genre VARCHAR(100),
  available INT DEFAULT 1,
  cover_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowed books table (mirrors original 'borrowed_books' table)
CREATE TABLE IF NOT EXISTS borrowed_books (
  borrow_id SERIAL PRIMARY KEY,
  book_id INT REFERENCES books(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  return_due_date TIMESTAMP,
  is_borrowed BOOLEAN DEFAULT TRUE
);

-- Returned books table (mirrors original 'returned_books' table)
CREATE TABLE IF NOT EXISTS returned_books (
  returned_id SERIAL PRIMARY KEY,
  book_id INT REFERENCES books(id) ON DELETE SET NULL,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255),
  author VARCHAR(255),
  borrow_date TIMESTAMP,
  return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book requests table (mirrors original 'book_requests' table)
CREATE TABLE IF NOT EXISTS book_requests (
  request_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  published_year INT,
  genre VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table (mirrors original 'notifications' table)
CREATE TABLE IF NOT EXISTS notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  book_id INT REFERENCES books(id) ON DELETE SET NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table (mirrors original 'orders' table)
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(100),
  address TEXT,
  total_price DECIMAL(10,2),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table (mirrors original 'order_items' table)
CREATE TABLE IF NOT EXISTS order_items (
  item_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
  book_id INT REFERENCES books(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1
);

-- Cart table (for shopping cart functionality)
CREATE TABLE IF NOT EXISTS cart (
  cart_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  book_id INT REFERENCES books(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, book_id)
);

-- ============================================
-- SECTION 2: INDEXES (for performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_borrowed_books_user ON borrowed_books(user_id);
CREATE INDEX IF NOT EXISTS idx_borrowed_books_book ON borrowed_books(book_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_book_requests_user ON book_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_book_requests_status ON book_requests(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);

-- ============================================
-- SECTION 3: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowed_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE returned_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid()::INT = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::INT = user_id);

-- Users can insert themselves (signup)
CREATE POLICY "Users can insert themselves"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::INT = user_id);

-- Admins can read all users
CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.admin_id = auth.uid()::INT
    )
  );

-- ============================================
-- BOOKS POLICIES
-- ============================================

-- Everyone can read books (public browsing)
CREATE POLICY "Everyone can read books"
  ON books FOR SELECT
  TO public
  USING (true);

-- Only admins can insert/update/delete books
CREATE POLICY "Admins can manage books"
  ON books FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.admin_id = auth.uid()::INT
    )
  );

-- ============================================
-- BORROWED BOOKS POLICIES
-- ============================================

-- Users can read their own borrowed books
CREATE POLICY "Users can read own borrowed books"
  ON borrowed_books FOR SELECT
  USING (auth.uid()::INT = user_id);

-- Users can insert borrow requests
CREATE POLICY "Users can insert borrowed books"
  ON borrowed_books FOR INSERT
  WITH CHECK (auth.uid()::INT = user_id);

-- Users can update (return) their own borrowed books
CREATE POLICY "Users can update own borrowed books"
  ON borrowed_books FOR UPDATE
  USING (auth.uid()::INT = user_id);

-- Admins can read all borrowed books
CREATE POLICY "Admins can read all borrowed books"
  ON borrowed_books FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.admin_id = auth.uid()::INT
    )
  );

-- ============================================
-- BOOK REQUESTS POLICIES
-- ============================================

-- Users can read their own requests
CREATE POLICY "Users can read own requests"
  ON book_requests FOR SELECT
  USING (auth.uid()::INT = user_id);

-- Users can insert requests
CREATE POLICY "Users can insert requests"
  ON book_requests FOR INSERT
  WITH CHECK (auth.uid()::INT = user_id);

-- Admins can read all requests
CREATE POLICY "Admins can read all requests"
  ON book_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.admin_id = auth.uid()::INT
    )
  );

-- Admins can update requests
CREATE POLICY "Admins can update requests"
  ON book_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.admin_id = auth.uid()::INT
    )
  );

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::INT = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid()::INT = user_id);

-- System can insert notifications (via API)
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Admins can read all notifications
CREATE POLICY "Admins can read all notifications"
  ON notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.admin_id = auth.uid()::INT
    )
  );

-- ============================================
-- CART POLICIES
-- ============================================

-- Users can manage their own cart
CREATE POLICY "Users can manage own cart"
  ON cart FOR ALL
  USING (auth.uid()::INT = user_id);

-- ============================================
-- ORDERS & ORDER ITEMS POLICIES
-- ============================================

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid()::INT = user_id);

-- Users can insert orders
CREATE POLICY "Users can insert orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid()::INT = user_id);

-- Users can read their own order items
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = order_items.order_id
      AND orders.user_id = auth.uid()::INT
    )
  );

-- Users can insert order items
CREATE POLICY "Users can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = order_items.order_id
      AND orders.user_id = auth.uid()::INT
    )
  );

-- ============================================
-- SECTION 4: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to handle user signup (creates auth user + profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, username, email, password)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.email,
    '' -- Password handled by Supabase Auth
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SECTION 5: SAMPLE DATA (optional - remove in production)
-- ============================================

-- Insert sample admin (password: admin123 - hash with bcrypt in production!)
INSERT INTO admins (username, password) VALUES
  ('admin', '$2a$10$YourHashedPasswordHere'); -- Replace with actual bcrypt hash

-- Insert sample books
INSERT INTO books (title, author, published_year, genre, available) VALUES
  ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Classic', 5),
  ('To Kill a Mockingbird', 'Harper Lee', 1960, 'Classic', 3),
  ('1984', 'George Orwell', 1949, 'Dystopian', 4),
  ('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 1997, 'Fantasy', 7),
  ('The Catcher in the Rye', 'J.D. Salinger', 1951, 'Coming-of-age', 2);

-- ============================================
-- SECTION 6: STORAGE BUCKET SETUP
-- ============================================

-- Note: Run this separately in Supabase Dashboard:
-- 1. Go to Storage → New Bucket
-- 2. Name it "book-covers"
-- 3. Make it Public
-- 4. Set up policies for uploading

-- Storage policies for book covers (run after creating bucket)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('book-covers', 'book-covers', true);

-- Allow users to upload book covers
-- CREATE POLICY "Users can upload book covers" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'book-covers');

-- Allow everyone to view book covers
-- CREATE POLICY "Everyone can view book covers" ON storage.objects
--   FOR SELECT USING (bucket_id = 'book-covers');

-- Allow admins to delete book covers
-- CREATE POLICY "Admins can delete book covers" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'book-covers' AND
--     EXISTS (SELECT 1 FROM admins WHERE admins.admin_id = auth.uid()::INT)
--   );

-- ============================================
-- NEXT STEPS AFTER RUNNING THIS SCRIPT:
-- 1. Go to Authentication → Settings → Configure redirect URLs
-- 2. Go to Storage → Create "book-covers" bucket → Set to Public
-- 3. Copy your Project URL and anon key from Settings → API
-- 4. Add these to your .env file (see .env.example)
-- ============================================