-- 1. students 테이블에 age 필드 추가 (기존 grade 외에 나이 관리)
ALTER TABLE students ADD COLUMN IF NOT EXISTS age INTEGER;

-- 2. staff 테이블 생성 (교직원 관리)
CREATE TABLE IF NOT EXISTS staff (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  staff_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL, -- Teacher, Admin, Support, etc.
  department VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. staff 테이블에 대한 RLS 설정
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users" 
ON staff FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" 
ON staff FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" 
ON staff FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" 
ON staff FOR DELETE 
USING (auth.role() = 'authenticated');

-- 4. 샘플 교직원 데이터 삽입
INSERT INTO staff (staff_id, first_name, last_name, role, department, contact_email)
VALUES
  ('STAFF001', 'Robert', 'Miller', 'Principal', 'Administration', 'principal@mcs.edu.mm'),
  ('STAFF002', 'Linda', 'Wilson', 'Senior Teacher', 'Science', 'linda.w@mcs.edu.mm'),
  ('STAFF003', 'William', 'Taylor', 'Teacher', 'Mathematics', 'william.t@mcs.edu.mm')
ON CONFLICT (staff_id) DO NOTHING;
