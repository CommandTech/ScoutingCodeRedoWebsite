import os
import pandas as pd
import configparser

# Read configuration
config = configparser.ConfigParser()
config.read('config.ini')
excel_sheet_name = config['CSVmaker']['excel_sheet_name']
code = config['CSVmaker']['code']

def convert_excel_to_csv():
    excel_file = f'backend/uploads/{excel_sheet_name}'
    output_dir = 'frontend/public/ExcelCSVFiles'
    
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
        
        # Check if cell B1 contains the string
        if df_code.iloc[0, 0] == code:
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)
                csv_file = os.path.join(output_dir, f'{sheet_name}.csv')
                df.to_csv(csv_file, index=False)
                print(f'Sheet {sheet_name} saved as {csv_file}')
        else:
            print(f'Error: Cell B1 in sheet "Code" does not contain the string "{code}".')
    else:
        print('Error: Sheet "Code" does not exist in the Excel file.')

if __name__ == "__main__":
    convert_excel_to_csv()