import os
import pandas as pd
import time

def convert_excel_to_csv():
    excel_file = r'backend\uploads\ScoutingWebsiteTest.xlsx'
    output_dir = r'frontend\public\ExcelCSVFiles'
    
    # Check if the Excel file exists
    if not os.path.exists(excel_file):
        print(f'Error: The file {excel_file} does not exist.')
        return
    
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    xls = pd.ExcelFile(excel_file)
    
    # Check if the sheet "code" exists
    if 'Code' in xls.sheet_names:
        df_code = pd.read_excel(excel_file, sheet_name='Code')
        
        # Check if df_code is empty
        if df_code.empty:
            print('Error: Sheet "Code" is empty.')
            return
        
        # Check if cell B1 contains the string "test"
        if df_code.iloc[0, 0] == 'test':
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)
                csv_file = os.path.join(output_dir, f'{sheet_name}.csv')
                df.to_csv(csv_file, index=False)
                print(f'Sheet {sheet_name} saved as {csv_file}')
        else:
            print('Error: Cell B1 in sheet "code" does not contain the string "test".')
    else:
        print('Error: Sheet "code" does not exist in the Excel file.')

# Loop to keep running the function
while True:
    convert_excel_to_csv()
    time.sleep(60)