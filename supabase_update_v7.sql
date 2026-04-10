-- 1. students 테이블에 미얀마 공식 양식에 필요한 상세 필드 추가
DO $$ 
BEGIN 
    -- Roll Number (학번/출석번호)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='roll_no') THEN
        ALTER TABLE students ADD COLUMN roll_no VARCHAR(100);
    END IF;
    
    -- Registered Graduate No (등록 번호)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='reg_no') THEN
        ALTER TABLE students ADD COLUMN reg_no VARCHAR(100);
    END IF;
    
    -- National/Foreigner Registration No (NRC 번호)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='nrc_no') THEN
        ALTER TABLE students ADD COLUMN nrc_no VARCHAR(100);
    END IF;
    
    -- Regional Centre (지역 센터)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='regional_centre') THEN
        ALTER TABLE students ADD COLUMN regional_centre VARCHAR(255);
    END IF;
    
    -- Father's Name (부친 성함 - 증명서 필수 항목)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='father_name') THEN
        ALTER TABLE students ADD COLUMN father_name VARCHAR(255);
    END IF;
    
    -- Specialization (전공/특기)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='specialization') THEN
        ALTER TABLE students ADD COLUMN specialization VARCHAR(255);
    END IF;
END $$;
