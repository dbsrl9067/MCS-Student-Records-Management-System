-- 1. students 테이블 생성 및 필드 추가
CREATE TABLE IF NOT EXISTS students (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  age INTEGER,
  grade INTEGER DEFAULT 1,
  gender VARCHAR(20),
  ethnicity VARCHAR(100),
  is_baptized BOOLEAN DEFAULT FALSE,
  attendance_rate NUMERIC DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. staff 테이블 생성 및 필드 추가
CREATE TABLE IF NOT EXISTS staff (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  staff_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_faculty BOOLEAN DEFAULT TRUE, -- TRUE: 교원, FALSE: 직원
  role VARCHAR(100) NOT NULL, -- Teacher, Admin, Support, etc.
  department VARCHAR(100),
  subjects TEXT, -- 담당 과목 (교원용)
  classes TEXT, -- 수업명 (교원용)
  photo_url TEXT, -- 사진 URL
  job_title TEXT, -- 직무 (직무용)
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. RLS(Row Level Security) 활성화
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- 4. 기존 정책(Policy) 삭제 후 재생성 (오류 방지)
-- Students 테이블 정책
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for authenticated users' AND tablename = 'students') THEN
        DROP POLICY "Allow read access for authenticated users" ON students;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert for authenticated users' AND tablename = 'students') THEN
        DROP POLICY "Allow insert for authenticated users" ON students;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update for authenticated users' AND tablename = 'students') THEN
        DROP POLICY "Allow update for authenticated users" ON students;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow delete for authenticated users' AND tablename = 'students') THEN
        DROP POLICY "Allow delete for authenticated users" ON students;
    END IF;
END $$;

CREATE POLICY "Allow read access for authenticated users" ON students FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON students FOR UPDATE USING (true);
CREATE POLICY "Allow delete for authenticated users" ON students FOR DELETE USING (true);

-- Staff 테이블 정책
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for authenticated users' AND tablename = 'staff') THEN
        DROP POLICY "Allow read access for authenticated users" ON staff;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert for authenticated users' AND tablename = 'staff') THEN
        DROP POLICY "Allow insert for authenticated users" ON staff;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update for authenticated users' AND tablename = 'staff') THEN
        DROP POLICY "Allow update for authenticated users" ON staff;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow delete for authenticated users' AND tablename = 'staff') THEN
        DROP POLICY "Allow delete for authenticated users" ON staff;
    END IF;
END $$;

CREATE POLICY "Allow read access for authenticated users" ON staff FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users" ON staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users" ON staff FOR UPDATE USING (true);
CREATE POLICY "Allow delete for authenticated users" ON staff FOR DELETE USING (true);

-- 5. 샘플 데이터 삽입 (중복 방지)
INSERT INTO staff (staff_id, first_name, last_name, is_faculty, role, department, subjects, classes, contact_email)
VALUES
  ('STAFF001', 'Robert', 'Miller', FALSE, 'Principal', 'Administration', NULL, NULL, 'principal@mcs.edu.mm'),
  ('STAFF002', 'Linda', 'Wilson', TRUE, 'Senior Teacher', 'Science', 'Science, Biology', 'Grade 10-A, 11-B', 'linda.w@mcs.edu.mm'),
  ('STAFF003', 'William', 'Taylor', TRUE, 'Teacher', 'Mathematics', 'Mathematics', 'Grade 9-C', 'william.t@mcs.edu.mm')
ON CONFLICT (staff_id) DO NOTHING;
