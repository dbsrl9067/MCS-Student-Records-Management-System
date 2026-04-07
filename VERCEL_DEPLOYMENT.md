# Vercel 배포 가이드

이 문서는 MCS Student Information System을 Vercel에 배포하고 Supabase와 연동하는 방법을 설명합니다.

## 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 접속하여 GitHub 계정으로 로그인합니다.
2. **Import Project**를 클릭하고 `dbsrl9067/MCS-Student-Records-Management-System` 저장소를 선택합니다.
3. 프로젝트 설정에서 **Framework Preset**을 `Next.js`로 설정합니다.

## 2. 환경 변수 설정 (중요)

Vercel 프로젝트 대시보드에서 다음 단계를 수행합니다:

1. **Settings > Environment Variables**로 이동합니다.
2. 다음 환경 변수를 추가합니다:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://scwewruishfwadabfmht.supabase.co` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_EKuUeZmCtOul5PgPOkDSOA_UzaOSMl7` | Supabase Anon API Key |

**주의**: `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트 측에서 노출되므로, 공개 API 키(anon key)만 사용합니다.

3. 각 환경 변수를 추가한 후 **Save** 버튼을 클릭합니다.

## 3. 배포

1. **Deploy** 버튼을 클릭하여 배포를 시작합니다.
2. 배포가 완료되면 Vercel에서 제공하는 URL을 통해 애플리케이션에 접속할 수 있습니다.

## 4. Supabase 테이블 생성

배포 전에 Supabase에서 다음 작업을 완료해야 합니다:

1. [Supabase 대시보드](https://app.supabase.com)에 접속합니다.
2. 프로젝트를 선택하고 **SQL Editor**로 이동합니다.
3. `supabase_init.sql` 파일의 SQL 쿼리를 복사하여 실행합니다.
4. 쿼리 실행 후 **Table Editor**에서 `students` 테이블이 생성되었는지 확인합니다.

## 5. 배포 후 확인

배포 완료 후 다음을 확인합니다:

1. **데이터 로드 확인**: 애플리케이션에 접속하여 학생 목록이 정상적으로 표시되는지 확인합니다.
2. **CRUD 기능 테스트**:
   - 새 학생 추가
   - 학생 정보 조회
   - 학생 정보 삭제
3. **통계 업데이트**: 학생 추가/삭제 시 통계가 실시간으로 업데이트되는지 확인합니다.

## 6. 문제 해결

### "Supabase environment variables are not set" 오류
- Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인합니다.
- 환경 변수 추가 후 새로운 배포를 시작합니다.

### 데이터가 로드되지 않음
- Supabase 대시보드에서 `students` 테이블이 생성되었는지 확인합니다.
- Supabase의 **RLS (Row Level Security)** 정책이 올바르게 설정되었는지 확인합니다.
- 브라우저 개발자 도구의 Console 탭에서 오류 메시지를 확인합니다.

### CORS 오류
- Supabase 대시보드의 **Settings > API > CORS**에서 Vercel 배포 URL을 추가합니다.
- 형식: `https://your-vercel-project.vercel.app`

## 7. 프로덕션 보안 권장사항

1. **Row Level Security (RLS) 활성화**: 사용자 인증 후에만 데이터 접근 가능하도록 설정합니다.
2. **API 키 관리**: 공개 키(anon key)와 비공개 키(service role key)를 분리합니다.
3. **정기적인 백업**: Supabase에서 정기적으로 데이터베이스 백업을 수행합니다.

## 8. 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vercel + Next.js 배포 가이드](https://vercel.com/docs/frameworks/nextjs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase + Next.js 통합](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
