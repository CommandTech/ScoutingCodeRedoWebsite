import os
import sys
import pandas as pd
import configparser
import warnings

def convert_excel_to_csv(file_path):
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
    
    output_dir = os.path.join(script_dir, 'frontend', 'public', 'ExcelCSVFiles')
    code = config['CSVmaker']['code'].split(';')[0].strip()  # Get the code value from the config file and strip the comment
    
    print(f"Code from config: {code}")
    
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    file_name = os.path.basename(file_path)
    print(f"Processing file: {file_name}")
    if file_name.endswith('.xlsx') or file_name.endswith('.xls'):
        print(f"Converting {file_name} to CSV files")
        remove_file = False
        with pd.ExcelFile(file_path) as xls:
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
                os.remove(file_path)
                print(f"Removed file: {file_name}")
            except PermissionError as e:
                print(f"Error removing file {file_name}: {e}")
        else:
            # Delete old CSV files in the output directory
            for csv_file_name in os.listdir(output_dir):
                csv_file_path = os.path.join(output_dir, csv_file_name)
                if csv_file_name.endswith('.csv') and os.path.exists(csv_file_path):
                    os.remove(csv_file_path)
            
            # Convert each sheet to a CSV file
        with pd.ExcelFile(file_path) as xls:
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=sheet_name)
                csv_file = os.path.join(output_dir, f"{sheet_name}.csv")
                df.to_csv(csv_file, index=False)
                print(f"Converted {sheet_name} to {csv_file}")
        
        # Print success message
        print("All CSVs have been successfully created.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python csvMaker.py <file_path>")
    else:
        convert_excel_to_csv(sys.argv[1])