import pandas as pd
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional, Any
import logging
from dataclasses import dataclass
from enum import Enum
import PyPDF2
import pdfplumber
import tabula
import openpyxl
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FileType(Enum):
    CSV = "csv"
    EXCEL = "excel"
    PDF = "pdf"

@dataclass
class TransactionData:
    """Data class to hold transaction information"""
    date: datetime
    description: str
    amount: float
    category: str
    transaction_type: str
    balance: Optional[float] = None
    reference: Optional[str] = None

@dataclass
class StatementSummary:
    """Data class to hold statement summary information"""
    total_income: float
    total_expenses: float
    net_savings: float
    transaction_count: int
    date_range: Dict[str, str]
    account_info: Dict[str, Any]

class StatementProcessor:
    def __init__(self, currency: str = 'NGN'):
        self.currency = currency
        self.transactions: List[TransactionData] = []
        self.file_type: Optional[FileType] = None
        self.raw_data: Optional[pd.DataFrame] = None
        
        # Enhanced categorization keywords
        self.category_keywords = {
            'Income': [
                'salary', 'payroll', 'income', 'paycheck', 'wages', 'bonus',
                'dividend', 'interest', 'deposit', 'credit', 'refund', 'cashback',
                'freelance', 'commission', 'allowance', 'grant', 'stipend'
            ],
            'Rent/Mortgage': [
                'rent', 'mortgage', 'housing', 'landlord', 'property', 'lease',
                'apartment', 'house payment', 'accommodation'
            ],
            'Groceries': [
                'groceries', 'supermarket', 'walmart', 'market', 'food mart',
                'grocery', 'provisions', 'shoprite', 'spar', 'park n shop',
                'fresh market', 'hypermarket'
            ],
            'Transport': [
                'uber', 'lyft', 'transport', 'bus', 'train', 'taxi', 'fuel',
                'petrol', 'gas station', 'parking', 'toll', 'metro', 'brt',
                'okada', 'keke', 'danfo', 'bolt'
            ],
            'Food & Dining': [
                'restaurant', 'cafe', 'food', 'diner', 'eatery', 'pizza',
                'burger', 'kfc', 'dominos', 'chicken republic', 'fast food',
                'lunch', 'dinner', 'breakfast', 'snack'
            ],
            'Entertainment/Subscriptions': [
                'spotify', 'netflix', 'hulu', 'prime video', 'disney', 'dstv',
                'gotv', 'showmax', 'cinema', 'movie', 'game', 'subscription',
                'streaming', 'music', 'entertainment'
            ],
            'Health': [
                'pharmacy', 'health', 'hospital', 'doctor', 'medical', 'clinic',
                'medicine', 'drug', 'treatment', 'consultation', 'lab test',
                'dental', 'optical', 'healthcare'
            ],
            'Utilities': [
                'utility', 'electricity', 'water', 'gas', 'phone', 'internet',
                'nepa', 'phcn', 'mtn', 'glo', 'airtel', '9mobile', 'spectranet',
                'cable', 'waste', 'security'
            ],
            'Shopping': [
                'shopping', 'store', 'retail', 'mall', 'boutique', 'fashion',
                'clothing', 'shoes', 'electronics', 'amazon', 'jumia', 'konga',
                'ebay', 'online store'
            ],
            'Travel': [
                'travel', 'airline', 'hotel', 'flight', 'booking', 'vacation',
                'trip', 'tourism', 'resort', 'airbnb', 'visa', 'passport'
            ],
            'Education': [
                'education', 'school', 'tuition', 'course', 'training', 'book',
                'university', 'college', 'certification', 'workshop', 'seminar'
            ],
            'Financial Services': [
                'loan', 'credit card', 'bank', 'insurance', 'investment',
                'savings', 'pension', 'mutual fund', 'stock', 'trading'
            ],
            'Bank Fees': [
                'fee', 'charge', 'commission', 'penalty', 'maintenance',
                'transaction fee', 'service charge', 'atm fee', 'overdraft'
            ],
            'Transfer': [
                'transfer', 'send money', 'receive money', 'wire', 'remittance',
                'p2p', 'person to person', 'family transfer'
            ]
        }

    def detect_file_type(self, filepath: str) -> FileType:
        """Detect file type based on extension"""
        path = Path(filepath)
        extension = path.suffix.lower()
        
        if extension == '.csv':
            return FileType.CSV
        elif extension in ['.xlsx', '.xls']:
            return FileType.EXCEL
        elif extension == '.pdf':
            return FileType.PDF
        else:
            raise ValueError(f"Unsupported file type: {extension}")

    def read_csv_file(self, filepath: str) -> pd.DataFrame:
        """Read CSV file with enhanced error handling"""
        try:
            # Try different encodings
            encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
            for encoding in encodings:
                try:
                    df = pd.read_csv(filepath, encoding=encoding)
                    logger.info(f"Successfully read CSV with {encoding} encoding")
                    return df
                except UnicodeDecodeError:
                    continue
            
            # If all encodings fail, try with errors='ignore'
            df = pd.read_csv(filepath, encoding='utf-8', errors='ignore')
            logger.warning("Read CSV with some character encoding issues")
            return df
            
        except Exception as e:
            logger.error(f"Error reading CSV file: {e}")
            raise

    def read_excel_file(self, filepath: str) -> pd.DataFrame:
        """Read Excel file with sheet detection"""
        try:
            # Read all sheets and find the one with transaction data
            excel_file = pd.ExcelFile(filepath)
            logger.info(f"Excel sheets found: {excel_file.sheet_names}")
            
            # Try to find the sheet with transaction data
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(filepath, sheet_name=sheet_name)
                if self._looks_like_transaction_data(df):
                    logger.info(f"Using sheet: {sheet_name}")
                    return df
            
            # If no sheet looks like transaction data, use the first sheet
            logger.warning("No sheet clearly contains transaction data, using first sheet")
            return pd.read_excel(filepath, sheet_name=0)
            
        except Exception as e:
            logger.error(f"Error reading Excel file: {e}")
            raise

    def read_pdf_file(self, filepath: str) -> pd.DataFrame:
        """Read PDF file and extract transaction data"""
        try:
            # Method 1: Try tabula-py for table extraction
            try:
                tables = tabula.read_pdf(filepath, pages='all', multiple_tables=True)
                for i, table in enumerate(tables):
                    if self._looks_like_transaction_data(table):
                        logger.info(f"Using table {i} from PDF")
                        return table
            except Exception as e:
                logger.warning(f"Tabula extraction failed: {e}")
            
            # Method 2: Try pdfplumber for more complex extraction
            try:
                return self._extract_with_pdfplumber(filepath)
            except Exception as e:
                logger.warning(f"PDFPlumber extraction failed: {e}")
            
            # Method 3: Basic text extraction with PyPDF2
            return self._extract_with_pypdf2(filepath)
            
        except Exception as e:
            logger.error(f"Error reading PDF file: {e}")
            raise

    def _extract_with_pdfplumber(self, filepath: str) -> pd.DataFrame:
        """Extract data using pdfplumber"""
        import pdfplumber
        
        all_tables = []
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                all_tables.extend(tables)
        
        if not all_tables:
            raise ValueError("No tables found in PDF")
        
        # Convert the largest table to DataFrame
        largest_table = max(all_tables, key=len)
        df = pd.DataFrame(largest_table[1:], columns=largest_table[0])
        
        return df

    def _extract_with_pypdf2(self, filepath: str) -> pd.DataFrame:
        """Extract data using PyPDF2 (basic text extraction)"""
        import PyPDF2
        
        text_content = ""
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text_content += page.extract_text()
        
        # Try to parse transaction-like patterns from text
        lines = text_content.split('\n')
        transactions = []
        
        for line in lines:
            # Look for lines that might contain transaction data
            # This is a basic pattern - you might need to adjust based on your PDF format
            if re.search(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', line):  # Date pattern
                transactions.append(line.strip())
        
        if not transactions:
            raise ValueError("No transaction patterns found in PDF text")
        
        # This is a simplified approach - you'd need more sophisticated parsing
        # based on your specific PDF format
        df = pd.DataFrame({'raw_text': transactions})
        return df

    def _looks_like_transaction_data(self, df: pd.DataFrame) -> bool:
        """Check if DataFrame looks like transaction data"""
        if df.empty or len(df.columns) < 3:
            return False
        
        # Check for common column patterns
        columns_str = ' '.join(df.columns.astype(str).str.lower())
        
        has_date = any(keyword in columns_str for keyword in ['date', 'time', 'posted', 'effective'])
        has_amount = any(keyword in columns_str for keyword in ['amount', 'debit', 'credit', 'value'])
        has_description = any(keyword in columns_str for keyword in ['description', 'details', 'memo', 'narration'])
        
        return has_date and has_amount and has_description

    def standardize_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        """Standardize column names across different file formats"""
        # Enhanced column mapping
        column_mapping = {
            # Date columns
            'date': ['date', 'transaction date', 'posted date', 'effective date', 
                    'activity date', 'value date', 'tran date', 'booking date',
                    'trans date', 'process date', 'settlement date'],
            
            # Description columns
            'description': ['description', 'transaction description', 'details', 'memo',
                          'transaction details', 'payee', 'narration', 'transaction type',
                          'reference', 'remarks', 'particulars'],
            
            # Amount columns
            'amount': ['amount', 'value', 'transaction amount', 'net amount'],
            'debit': ['debit', 'withdrawal', 'outgoing', 'paid out', 'dr'],
            'credit': ['credit', 'deposit', 'incoming', 'received', 'cr'],
            
            # Balance columns
            'balance': ['balance', 'running balance', 'available balance', 'current balance'],
            
            # Reference columns
            'reference': ['reference', 'ref', 'transaction id', 'trans id', 'check number']
        }
        
        # Create a mapping for actual columns in the DataFrame
        df_columns = df.columns.str.lower().str.strip()
        actual_mapping = {}
        
        for standard_name, variations in column_mapping.items():
            for variation in variations:
                matching_cols = [col for col in df_columns if variation in col]
                if matching_cols:
                    # Use the first matching column
                    original_col = df.columns[df_columns.get_loc(matching_cols[0])]
                    actual_mapping[original_col] = standard_name
                    break
        
        # Rename columns
        df = df.rename(columns=actual_mapping)
        
        # Handle split debit/credit columns
        if 'debit' in df.columns and 'credit' in df.columns:
            df['debit'] = pd.to_numeric(df['debit'], errors='coerce').fillna(0)
            df['credit'] = pd.to_numeric(df['credit'], errors='coerce').fillna(0)
            df['amount'] = df['credit'] - df['debit']
        elif 'debit' in df.columns and 'amount' not in df.columns:
            df['amount'] = -pd.to_numeric(df['debit'], errors='coerce').fillna(0)
        elif 'credit' in df.columns and 'amount' not in df.columns:
            df['amount'] = pd.to_numeric(df['credit'], errors='coerce').fillna(0)
        
        return df

    def categorize_transaction(self, description: str, amount: float = None) -> str:
        """Enhanced transaction categorization"""
        if pd.isna(description):
            return 'Miscellaneous'
        
        description = str(description).lower().strip()
        
        # Check each category
        for category, keywords in self.category_keywords.items():
            if any(keyword in description for keyword in keywords):
                return category
        
        # Fallback based on amount
        if amount is not None:
            if amount > 0:
                return 'Income'
            else:
                return 'Miscellaneous Expense'
        
        return 'Miscellaneous'

    def find_recurring_transactions(self, df: pd.DataFrame) -> List[Dict]:
        """Enhanced recurring transaction detection"""
        if df.empty:
            return []
        
        # Focus on expenses
        expenses = df[df['amount'] < 0].copy()
        if expenses.empty:
            return []
        
        # Normalize descriptions for grouping
        expenses['normalized_desc'] = expenses['description'].str.lower().str.strip()
        
        # Group by normalized description
        grouped = expenses.groupby('normalized_desc').agg({
            'amount': ['count', 'mean', 'std'],
            'date': list,
            'description': 'first'  # Keep original description
        }).reset_index()
        
        # Flatten column names
        grouped.columns = ['normalized_desc', 'count', 'mean_amount', 'std_amount', 'dates', 'original_desc']
        
        # Filter for potential recurring transactions
        recurring_candidates = grouped[
            (grouped['count'] >= 2) &
            (grouped['std_amount'].fillna(0) < 10.0)  # Allow for some variation
        ]
        
        recurring_list = []
        for _, row in recurring_candidates.iterrows():
            dates = sorted(pd.to_datetime(row['dates']))
            if len(dates) < 2:
                continue
            
            # Calculate intervals between transactions
            intervals = [(dates[i+1] - dates[i]).days for i in range(len(dates)-1)]
            avg_interval = sum(intervals) / len(intervals)
            
            # Determine frequency
            frequency = 'Unknown'
            if 6 <= avg_interval <= 8:
                frequency = 'Weekly'
            elif 25 <= avg_interval <= 35:
                frequency = 'Monthly'
            elif 85 <= avg_interval <= 95:
                frequency = 'Quarterly'
            elif avg_interval >= 350:
                frequency = 'Yearly'
            
            if frequency != 'Unknown':
                recurring_list.append({
                    'description': row['original_desc'],
                    'amount': abs(round(row['mean_amount'], 2)),
                    'frequency': frequency,
                    'count': int(row['count']),
                    'avg_interval_days': round(avg_interval, 1)
                })
        
        return sorted(recurring_list, key=lambda x: x['amount'], reverse=True)

    def analyze_spending_patterns(self, df: pd.DataFrame) -> Dict:
        """Analyze spending patterns and trends"""
        if df.empty:
            return {}
        
        expenses = df[df['amount'] < 0].copy()
        if expenses.empty:
            return {}
        
        expenses['amount_abs'] = abs(expenses['amount'])
        expenses['month'] = expenses['date'].dt.to_period('M')
        expenses['weekday'] = expenses['date'].dt.day_name()
        
        # Monthly spending trend
        monthly_spending = expenses.groupby('month')['amount_abs'].sum().to_dict()
        monthly_spending = {str(k): v for k, v in monthly_spending.items()}
        
        # Spending by day of week
        weekday_spending = expenses.groupby('weekday')['amount_abs'].sum().to_dict()
        
        # Category spending over time
        category_monthly = expenses.groupby(['month', 'category'])['amount_abs'].sum().unstack(fill_value=0)
        category_trends = {}
        for category in category_monthly.columns:
            category_trends[category] = category_monthly[category].to_dict()
            category_trends[category] = {str(k): v for k, v in category_trends[category].items()}
        
        return {
            'monthly_spending': monthly_spending,
            'weekday_spending': weekday_spending,
            'category_trends': category_trends
        }

    def extract_account_info(self, filepath: str) -> Dict:
        """Extract account information from file"""
        account_info = {
            'file_name': Path(filepath).name,
            'file_type': self.file_type.value if self.file_type else 'unknown',
            'processing_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # For PDF files, try to extract account details
        if self.file_type == FileType.PDF:
            try:
                with pdfplumber.open(filepath) as pdf:
                    first_page_text = pdf.pages[0].extract_text()
                    
                    # Look for account number patterns
                    account_patterns = [
                        r'account\s+(?:number|no\.?)\s*:?\s*(\d+)',
                        r'a/c\s+(?:number|no\.?)\s*:?\s*(\d+)',
                        r'account\s*:?\s*(\d{10,})'
                    ]
                    
                    for pattern in account_patterns:
                        match = re.search(pattern, first_page_text, re.IGNORECASE)
                        if match:
                            account_info['account_number'] = match.group(1)
                            break
                    
                    # Look for bank name
                    bank_patterns = [
                        r'(first bank|gtbank|access bank|zenith bank|uba|fidelity bank)',
                        r'(standard chartered|sterling bank|union bank|polaris bank)'
                    ]
                    
                    for pattern in bank_patterns:
                        match = re.search(pattern, first_page_text, re.IGNORECASE)
                        if match:
                            account_info['bank_name'] = match.group(1)
                            break
                            
            except Exception as e:
                logger.warning(f"Could not extract account info from PDF: {e}")
        
        return account_info

    def process_statement(self, filepath: str, salary: float = 0) -> str:
        """Main processing function with enhanced capabilities"""
        try:
            # Detect file type
            self.file_type = self.detect_file_type(filepath)
            logger.info(f"Processing {self.file_type.value} file: {filepath}")
            
            # Read file based on type
            if self.file_type == FileType.CSV:
                df = self.read_csv_file(filepath)
            elif self.file_type == FileType.EXCEL:
                df = self.read_excel_file(filepath)
            elif self.file_type == FileType.PDF:
                df = self.read_pdf_file(filepath)
            else:
                raise ValueError(f"Unsupported file type: {self.file_type}")
            
            # Standardize columns
            df = self.standardize_columns(df)
            
            # Validate required columns
            required_columns = ['date', 'description', 'amount']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return json.dumps({
                    "error": f"Missing required columns: {', '.join(missing_columns)}",
                    "available_columns": list(df.columns),
                    "suggestions": "Please ensure your file has Date, Description, and Amount columns"
                }, indent=2)
            
            # Clean and process data
            df = df.dropna(subset=['date', 'description', 'amount'])
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
            df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
            df = df.dropna(subset=['date', 'amount'])
            
            if df.empty:
                return json.dumps({"error": "No valid transactions found after cleaning"}, indent=2)
            
            # Add categories
            df['category'] = df.apply(lambda row: self.categorize_transaction(row['description'], row['amount']), axis=1)
            
            # Store raw data
            self.raw_data = df.copy()
            
            # Calculate summary statistics
            total_income = df[df['amount'] > 0]['amount'].sum() + salary
            total_expenses = abs(df[df['amount'] < 0]['amount'].sum())
            net_savings = total_income - total_expenses
            
            # Date range
            date_range = {
                'start': df['date'].min().strftime('%Y-%m-%d'),
                'end': df['date'].max().strftime('%Y-%m-%d')
            }
            
            # Spending breakdown
            spending_df = df[df['amount'] < 0].copy()
            spending_df['amount_abs'] = abs(spending_df['amount'])
            spending_breakdown = spending_df.groupby('category')['amount_abs'].sum().round(2).to_dict()
            
            # Income breakdown
            income_df = df[df['amount'] > 0].copy()
            income_breakdown = income_df.groupby('category')['amount'].sum().round(2).to_dict()
            if salary > 0:
                income_breakdown['Salary'] = salary
            
            # Highest transactions
            if not spending_df.empty:
                highest_expense = spending_df.loc[spending_df['amount_abs'].idxmax()]
                highest_expense_data = {
                    'description': highest_expense['description'],
                    'amount': highest_expense['amount_abs'],
                    'date': highest_expense['date'].strftime('%Y-%m-%d'),
                    'category': highest_expense['category']
                }
            else:
                highest_expense_data = None
            
            if not income_df.empty:
                highest_income = income_df.loc[income_df['amount'].idxmax()]
                highest_income_data = {
                    'description': highest_income['description'],
                    'amount': highest_income['amount'],
                    'date': highest_income['date'].strftime('%Y-%m-%d'),
                    'category': highest_income['category']
                }
            else:
                highest_income_data = None
            
            # Recurring transactions
            recurring_transactions = self.find_recurring_transactions(df)
            
            # Spending patterns
            spending_patterns = self.analyze_spending_patterns(df)
            
            # Account information
            account_info = self.extract_account_info(filepath)
            
            # Format transactions for output
            df['date'] = df['date'].dt.strftime('%Y-%m-%d')
            transactions = df.sort_values(by='date', ascending=False).to_dict('records')
            
            # Compile comprehensive output
            output = {
                'file_info': {
                    'type': self.file_type.value,
                    'name': Path(filepath).name,
                    'processing_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                },
                'account_info': account_info,
                'summary': {
                    'total_income': round(total_income, 2),
                    'total_expenses': round(total_expenses, 2),
                    'net_savings': round(net_savings, 2),
                    'transaction_count': len(df),
                    'date_range': date_range,
                    'currency': self.currency
                },
                'breakdowns': {
                    'spending_by_category': spending_breakdown,
                    'income_by_category': income_breakdown
                },
                'highlights': {
                    'highest_expense': highest_expense_data,
                    'highest_income': highest_income_data,
                    'recurring_transactions': recurring_transactions
                },
                'analysis': {
                    'spending_patterns': spending_patterns,
                    'average_daily_spending': round(total_expenses / max(1, (pd.to_datetime(date_range['end']) - pd.to_datetime(date_range['start'])).days), 2),
                    'most_frequent_category': max(spending_breakdown.items(), key=lambda x: x[1])[0] if spending_breakdown else None
                },
                'transactions': transactions
            }
            
            return json.dumps(output, indent=2, default=str)
            
        except Exception as e:
            logger.error(f"Error processing statement: {e}")
            return json.dumps({
                "error": f"Error processing statement: {str(e)}",
                "file_type": self.file_type.value if self.file_type else "unknown"
            }, indent=2)

# Usage example
def main():
    """Example usage of the enhanced statement processor"""
    processor = StatementProcessor(currency='NGN')
    
    # Process a statement file
    filepath = "your_statement.csv"  # or .xlsx, .pdf
    result = processor.process_statement(filepath, salary=150000)
    
    # Print or save the result
    print(result)
    
    # You can also save to a file
    with open('processed_statement.json', 'w') as f:
        f.write(result)

if __name__ == "__main__":
    main()