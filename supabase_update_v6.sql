-- 1. 학사 일정(Calendar) 테이블 생성
CREATE TABLE IF NOT EXISTS calendar_events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  category VARCHAR(50) DEFAULT 'Academic', -- Academic, Holiday, Event, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. RLS 활성화
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- 3. 보안 정책 설정 (오류 방지)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admin read access" ON calendar_events;
    DROP POLICY IF EXISTS "Admin insert access" ON calendar_events;
    DROP POLICY IF EXISTS "Admin update access" ON calendar_events;
    DROP POLICY IF EXISTS "Admin delete access" ON calendar_events;
END $$;

CREATE POLICY "Admin read access" ON calendar_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert access" ON calendar_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON calendar_events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON calendar_events FOR DELETE USING (auth.role() = 'authenticated');

-- 4. 샘플 학사 일정 데이터 삽입
INSERT INTO calendar_events (title, description, start_date, end_date, category)
VALUES
  ('2024 Spring Semester Starts', 'First day of the new academic year', '2024-05-01', NULL, 'Academic'),
  ('Myanmar New Year Holiday', 'Thingyan Festival', '2024-04-13', '2024-04-17', 'Holiday'),
  ('Mid-term Examination', 'Assessment for all grades', '2024-07-15', '2024-07-19', 'Academic'),
  ('Graduation Ceremony', 'Class of 2024 Graduation', '2024-03-25', NULL, 'Event')
ON CONFLICT DO NOTHING;
