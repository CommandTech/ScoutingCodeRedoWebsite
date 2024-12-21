import os
import pandas as pd
import configparser
import warnings

def convert_excel_to_csv():
    # Suppress specific warnings
    warnings.filterwarnings("ignore", category=UserWarning, module='openpyxl')

    # Read the config file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(script_dir, 'config.ini')
    print(f"Reading config from: {config_path}")
    
    if not os.path.exists(config_path):
        print(f"Error: Config file not found at {config_path}")
        return
    
    config = configparser.ConfigParser()
    config.read(config_path)
    
    # Debugging: Print sections and keys
    print(f"Config sections: {config.sections()}")
    if 'CSVmaker' in config:
        print(f"CSVmaker keys: {config['CSVmaker'].keys()}")
    
    if 'CSVmaker' not in config or 'code' not in config['CSVmaker']:
        print('Error: Missing "CSVmaker" section or "code" key in config.ini')
        return
    
    input_dir = os.path.join(script_dir, 'backend', 'uploads')
    output_dir = os.path.join(script_dir, 'frontend', 'public', 'ExcelCSVFiles')
    code = config['CSVmaker']['code'].split(';')[0].strip()  # Get the code value from the config file and strip the comment
    
    print(f"Code from config: {code}")
    
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Iterate over all Excel files in the input directory
    for file_name in os.listdir(input_dir):
        if file_name.endswith('.xlsx') or file_name.endswith('.xls'):
            excel_file = os.path.join(input_dir, file_name)
            
            remove_file = False
            with pd.ExcelFile(excel_file) as xls:
                # Check if the sheet "Code" exists
                if 'Code' not in xls.sheet_names:
                    print(f'Error: Sheet "Code" does not exist in file {file_name}. Marking for removal.')
                    remove_file = True
                else:
                    df_code = pd.read_excel(xls, sheet_name='Code')
                    
                    # Check if df_code is empty
                    if df_code.empty:
                        print(f'Error: Sheet "Code" in file {file_name} is empty. Marking for removal.')
                        remove_file = True
                    # Check if the value in cell A2 matches the code from the config
                    elif df_code.iloc[0, 0] != code:
                        print(f'Error: Cell A2 in sheet "Code" of file {file_name} does not match the code value. Marking for removal.')
                        remove_file = True
            
            if remove_file:
                # Ensure the file is closed before attempting to remove it
                try:
                    os.remove(excel_file)
                    print(f"Removed file: {file_name}")
                except PermissionError as e:
                    print(f"Error removing file {file_name}: {e}")
            else:
                # Delete old CSV files in the output directory
                for csv_file_name in os.listdir(output_dir):
                    if csv_file_name.endswith('.csv'):
                        os.remove(os.path.join(output_dir, csv_file_name))
                
                # Convert each sheet to a CSV file
                with pd.ExcelFile(excel_file) as xls:
                    base_name = os.path.splitext(file_name)[0]
                    for sheet_name in xls.sheet_names:
                        df = pd.read_excel(xls, sheet_name=sheet_name)
                        csv_file = os.path.join(output_dir, f"{base_name}_{sheet_name}.csv")
                        df.to_csv(csv_file, index=False)
                        print(f"Converted {sheet_name} to {csv_file}")

if __name__ == "__main__":
    convert_excel_to_csv()