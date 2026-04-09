# Supabase Setup Guide (v4)

이 문서는 MCS Academy 학적 관리 시스템을 위한 Supabase 데이터베이스 초기 설정 가이드입니다.

## 1. 테이블 및 보안 정책 설정

Supabase 대시보드의 **SQL Editor**에서 `supabase_full_setup_v4.sql` 파일의 내용을 복사하여 실행해 주세요.

이 스크립트는 다음 작업을 수행합니다:
- `students` 테이블 생성 및 확장 (나이, 학년 등)
- `staff` 테이블 생성 및 확장 (교원/직원 구분, 담당 과목, 사진 등)
- **보안 정책(RLS) 설정**: 기존 정책이 있을 경우 자동으로 삭제하고 재생성하여 오류를 방지합니다.
- 기본 샘플 데이터 삽입

## 2. 환경 변수 설정 (Vercel)

Vercel 프로젝트 설정의 **Environment Variables** 탭에서 다음 두 가지를 추가해야 합니다:

- `NEXT_PUBLIC_SUPABASE_URL`: `https://scwewruishfwadabfmht.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_EKuUeZmCtOul5PgPOkDSOA_UzaOSMl7`

## 3. 주의 사항

- SQL 실행 시 `policy already exists` 오류가 발생하지 않도록 `DO $$ ... END $$` 블록을 사용하여 안전하게 처리했습니다.
- 만약 테이블 구조를 완전히 초기화하고 싶다면, SQL Editor에서 `DROP TABLE students, staff;`를 먼저 실행한 후 스크립트를 다시 실행해 주세요.

## 4. 참고 파일

- `supabase_full_setup_v4.sql`: 전체 테이블 및 정책 설정 스크립트
- `src/lib/supabase.js`: 애플리케이션 내 Supabase 클라이언트 설정
