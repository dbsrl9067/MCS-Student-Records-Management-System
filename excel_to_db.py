import pandas as pd
import json
from datetime import datetime

def transform_excel(file_path):
    try:
        # 엑셀의 'Student_Info' 시트를 읽어옵니다.
        df = pd.read_excel(file_path, sheet_name='Student_Info')
        
        # 데이터 정제 및 날짜 포맷팅
        df['Birth_Date'] = pd.to_datetime(df['Birth_Date']).dt.strftime('%Y-%m-%d')
        
        results = []
        for _, row in df.iterrows():
            results.append({
                "sid": row['Temp_ID'],
                "name": {"mm": row['Name_MM'], "en": row['Name_EN']},
                "ethnicity": row['Ethnicity'],
                "nrc": row['NRC_No'],
                "baptism": {"status": row['Baptism'], "date": str(row.get('Baptism_Date', ""))},
                "sync_status": 0,
                "updated_at": datetime.now().isoformat()
            })
            
        with open('processed_data.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        return "Success: processed_data.json created."
    except Exception as e:
        return f"Error: {e}"

# 사용법: transform_excel('your_excel_file.xlsx')