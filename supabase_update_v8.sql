-- 학사 일정 카테고리 관리를 위한 테이블 생성
CREATE TABLE IF NOT EXISTS event_categories (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#FFD700', -- 기본 골드 색상
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 기존 calendar_events 테이블에 category_id 추가 (선택 사항, 여기서는 기존 category 텍스트 필드와 병행하거나 대체 가능)
-- 여기서는 기존 category 필드를 유지하면서, UI에서 event_categories의 정보를 참조하도록 구현합니다.

-- 기본 카테고리 데이터 삽입
INSERT INTO event_categories (name, color)
VALUES 
    ('Academic', '#003366'), -- 네이비
    ('Holiday', '#FF4D4D'),  -- 빨강
    ('Exam', '#4D79FF'),     -- 파랑
    ('Event', '#FFD700'),    -- 골드
    ('Other', '#808080')     -- 회색
ON CONFLICT (name) DO NOTHING;

-- 보안 정책 설정 (RLS)
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

-- 누구나 조회 가능
CREATE POLICY "Allow read access for all users" ON event_categories
    FOR SELECT USING (true);

-- 인증된 관리자만 추가/수정/삭제 가능
CREATE POLICY "Allow all access for authenticated users" ON event_categories
    FOR ALL USING (auth.role() = 'authenticated');
