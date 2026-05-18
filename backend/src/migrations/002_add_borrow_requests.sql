-- ============================================
-- Borrow Requests Table Migration
-- ============================================
-- This adds the borrow_requests table for the new borrow approval workflow

-- Create borrow_requests table
CREATE TABLE IF NOT EXISTS borrow_requests (
  request_id SERIAL PRIMARY KEY,
  book_id INT REFERENCES books(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_date TIMESTAMP,
  admin_id INT REFERENCES admins(admin_id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_borrow_requests_user ON borrow_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_status ON borrow_requests(status);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_book ON borrow_requests(book_id);

-- Note: RLS is enabled but policies are simplified
-- Application handles authorization through JWT middleware
-- For production, consider using service role key or app-specific auth

-- Enable RLS
ALTER TABLE borrow_requests ENABLE ROW LEVEL SECURITY;

-- Allow all operations through application-level auth (JWT verified in routes)
-- This is a simplified policy - in production, use proper auth.uid() matching
CREATE POLICY "Allow all operations on borrow_requests" 
  ON borrow_requests FOR ALL
  USING (true)
  WITH CHECK (true);