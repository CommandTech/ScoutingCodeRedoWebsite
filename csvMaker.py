import pandas as pd
import schedule
import time
import os

def convert_excel_to_csv():
    excel_file = r'C:\Users\alexb\Downloads\MPR-8-19-24.xlsx'
    output_dir = r'C:\Users\alexb\Documents\BackUp\Robotics\Website\ScoutingCodeRedoWebsite\ExcelCSVFiles'
    
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    xls = pd.ExcelFile(excel_file)
    
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(excel_file, sheet_name=sheet_name)
        csv_file = os.path.join(output_dir, f'{sheet_name}.csv')
        df.to_csv(csv_file, index=False)
        print(f'Sheet {sheet_name} saved as {csv_file}')

# Schedule the task to run every 1 minute
schedule.every(1).minutes.do(convert_excel_to_csv)

while True:
    schedule.run_pending()
    time.sleep(1)