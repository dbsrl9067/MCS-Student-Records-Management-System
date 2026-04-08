-- 1. staff 테이블에 교원/직원 세분화 필드 추가
ALTER TABLE staff ADD COLUMN IF NOT EXISTS is_faculty BOOLEAN DEFAULT TRUE; -- TRUE: 교원, FALSE: 직원
ALTER TABLE staff ADD COLUMN IF NOT EXISTS subjects TEXT; -- 담당 과목 (교원용)
ALTER TABLE staff ADD COLUMN IF NOT EXISTS classes TEXT; -- 수업명 (교원용)
ALTER TABLE staff ADD COLUMN IF NOT EXISTS photo_url TEXT; -- 사진 URL
ALTER TABLE staff ADD COLUMN IF NOT EXISTS job_title TEXT; -- 직무 (직원용)

-- 2. 샘플 데이터 업데이트 (기존 데이터에 필드 값 채우기)
UPDATE staff SET is_faculty = TRUE, subjects = 'Science, Biology', classes = 'Grade 10-A, 11-B' WHERE staff_id = 'STAFF002';
UPDATE staff SET is_faculty = TRUE, subjects = 'Mathematics', classes = 'Grade 9-C' WHERE staff_id = 'STAFF003';
UPDATE staff SET is_faculty = FALSE, job_title = 'School Principal' WHERE staff_id = 'STAFF001';

-- 3. 새로운 샘플 데이터 추가 (직원 예시)
INSERT INTO staff (staff_id, first_name, last_name, role, department, is_faculty, job_title, contact_email)
VALUES
  ('STAFF004', 'Sarah', 'Lee', 'Support', 'Facilities', FALSE, 'Facility Manager', 'sarah.l@mcs.edu.mm'),
  ('STAFF005', 'Kevin', 'Park', 'Admin', 'Finance', FALSE, 'Accountant', 'kevin.p@mcs.edu.mm')
ON CONFLICT (staff_id) DO NOTHING;
