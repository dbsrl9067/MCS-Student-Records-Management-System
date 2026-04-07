-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 3),
  date_of_birth DATE,
  gender VARCHAR(10),
  ethnicity VARCHAR(100),
  is_baptized BOOLEAN DEFAULT FALSE,
  attendance_rate DECIMAL(5, 2) DEFAULT 0,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  guardian_name VARCHAR(100),
  guardian_phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);

-- Enable RLS (Row Level Security)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read
CREATE POLICY "Allow read access for authenticated users" 
ON students FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policy to allow all authenticated users to insert
CREATE POLICY "Allow insert for authenticated users" 
ON students FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow all authenticated users to update
CREATE POLICY "Allow update for authenticated users" 
ON students FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create policy to allow all authenticated users to delete
CREATE POLICY "Allow delete for authenticated users" 
ON students FOR DELETE 
USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO students (student_id, first_name, last_name, grade, gender, ethnicity, is_baptized, attendance_rate)
VALUES
  ('STU001', 'John', 'Smith', 1, 'Male', 'Burmese', TRUE, 95),
  ('STU002', 'Mary', 'Johnson', 1, 'Female', 'Karen', TRUE, 92),
  ('STU003', 'David', 'Williams', 2, 'Male', 'Shan', FALSE, 88),
  ('STU004', 'Sarah', 'Brown', 2, 'Female', 'Burmese', TRUE, 94),
  ('STU005', 'Michael', 'Davis', 3, 'Male', 'Kachin', TRUE, 91),
  ('STU006', 'Emma', 'Wilson', 3, 'Female', 'Mon', FALSE, 89),
  ('STU007', 'James', 'Moore', 1, 'Male', 'Rakhine', TRUE, 93),
  ('STU008', 'Olivia', 'Taylor', 2, 'Female', 'Shan', TRUE, 96),
  ('STU009', 'Benjamin', 'Anderson', 3, 'Male', 'Burmese', FALSE, 87),
  ('STU010', 'Sophia', 'Thomas', 1, 'Female', 'Karen', TRUE, 90)
ON CONFLICT (student_id) DO NOTHING;
