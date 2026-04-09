-- 1. RLS 활성화 확인
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 삭제 (오류 방지 및 갱신)
DO $$ 
BEGIN
    -- Students 테이블 정책 삭제
    DROP POLICY IF EXISTS "Allow read access for authenticated users" ON students;
    DROP POLICY IF EXISTS "Allow insert for authenticated users" ON students;
    DROP POLICY IF EXISTS "Allow update for authenticated users" ON students;
    DROP POLICY IF EXISTS "Allow delete for authenticated users" ON students;
    
    -- Staff 테이블 정책 삭제
    DROP POLICY IF EXISTS "Allow read access for authenticated users" ON staff;
    DROP POLICY IF EXISTS "Allow insert for authenticated users" ON staff;
    DROP POLICY IF EXISTS "Allow update for authenticated users" ON staff;
    DROP POLICY IF EXISTS "Allow delete for authenticated users" ON staff;
END $$;

-- 3. 강화된 보안 정책 생성
-- [조회] 인증된 사용자(관리자)만 조회 가능
CREATE POLICY "Admin read access" ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read access" ON staff FOR SELECT USING (auth.role() = 'authenticated');

-- [추가/수정/삭제] 인증된 사용자(관리자)만 가능
CREATE POLICY "Admin insert access" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON students FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access" ON staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON staff FOR DELETE USING (auth.role() = 'authenticated');

-- 4. 관리자 계정 생성 안내 (SQL Editor에서 실행 불가, Auth UI 또는 API 사용)
-- 이메일: admin@mcs.edu.mm
-- 참고: Supabase Dashboard > Authentication > Users > Add User 메뉴를 통해 관리자를 추가하세요.
