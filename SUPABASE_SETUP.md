# Supabase 설정 가이드

이 문서는 MCS Student Information System을 Supabase와 연동하는 방법을 설명합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://app.supabase.com)에 접속하여 계정을 생성합니다.
2. 새로운 프로젝트를 생성합니다.
3. 프로젝트 생성 후 **Settings > API** 섹션에서 다음 정보를 복사합니다:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 2. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 3. 데이터베이스 테이블 생성

Supabase 대시보드의 **SQL Editor**에서 다음 SQL 쿼리를 실행하여 `students` 테이블을 생성합니다:

```sql
-- Create students table
CREATE TABLE students (
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
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_students_student_id ON students(student_id);

-- Enable RLS (Row Level Security) - Optional but recommended
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
```

## 4. 테이블 구조

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | BIGINT | 자동 생성 ID (Primary Key) |
| student_id | VARCHAR(50) | 학번 (고유값) |
| first_name | VARCHAR(100) | 이름 |
| last_name | VARCHAR(100) | 성 |
| grade | INTEGER | 학년 (1-3) |
| date_of_birth | DATE | 생년월일 |
| gender | VARCHAR(10) | 성별 |
| ethnicity | VARCHAR(100) | 민족 |
| is_baptized | BOOLEAN | 세례 여부 |
| attendance_rate | DECIMAL(5, 2) | 출석률 (%) |
| contact_email | VARCHAR(255) | 이메일 |
| contact_phone | VARCHAR(20) | 전화번호 |
| guardian_name | VARCHAR(100) | 보호자명 |
| guardian_phone | VARCHAR(20) | 보호자 전화번호 |
| notes | TEXT | 비고 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

## 5. 샘플 데이터 추가

테스트를 위해 Supabase 대시보드의 **Table Editor**에서 직접 데이터를 추가하거나, 다음 SQL을 실행합니다:

```sql
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
  ('STU010', 'Sophia', 'Thomas', 1, 'Female', 'Karen', TRUE, 90);
```

## 6. 애플리케이션에서 데이터 사용

클라이언트 컴포넌트에서 다음과 같이 Supabase 데이터를 조회할 수 있습니다:

```javascript
import { supabase } from '@/lib/supabase';

// 모든 학생 조회
const { data: students, error } = await supabase
  .from('students')
  .select('*')
  .order('student_id', { ascending: true });

// 특정 학년의 학생 조회
const { data: gradeStudents, error } = await supabase
  .from('students')
  .select('*')
  .eq('grade', 1);

// 새 학생 추가
const { data, error } = await supabase
  .from('students')
  .insert([
    {
      student_id: 'STU011',
      first_name: 'New',
      last_name: 'Student',
      grade: 1,
      gender: 'Male',
      ethnicity: 'Burmese',
      is_baptized: false,
      attendance_rate: 85
    }
  ]);

// 학생 정보 업데이트
const { data, error } = await supabase
  .from('students')
  .update({ attendance_rate: 92 })
  .eq('student_id', 'STU001');

// 학생 삭제
const { error } = await supabase
  .from('students')
  .delete()
  .eq('student_id', 'STU001');
```

## 7. 보안 설정 (선택사항)

프로덕션 환경에서는 다음을 권장합니다:

1. **Row Level Security (RLS) 활성화**: 사용자 인증 후에만 데이터 접근 가능
2. **API 키 관리**: 공개 키(anon key)와 비공개 키(service role key) 분리
3. **CORS 설정**: Vercel 배포 URL을 Supabase CORS 화이트리스트에 추가

## 8. 문제 해결

### "Supabase environment variables are not set" 경고
- `.env.local` 파일이 프로젝트 루트에 있는지 확인하세요.
- 개발 서버를 재시작하세요 (`npm run dev`).

### 데이터베이스 연결 오류
- Supabase 프로젝트 URL과 API 키가 정확한지 확인하세요.
- Supabase 대시보드에서 프로젝트 상태를 확인하세요.

### RLS 정책 오류
- 테이블의 RLS 정책이 올바르게 설정되어 있는지 확인하세요.
- 필요시 정책을 비활성화하고 테스트한 후 다시 활성화하세요.

## 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js와 Supabase 통합](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
