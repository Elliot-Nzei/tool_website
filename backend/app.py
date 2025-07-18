from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import json
import logging
from pathlib import Path
from typing import Optional
import tempfile
from statement_processor import StatementProcessor

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Enhanced Statement Processor API",
    description="Process bank statements in CSV, Excel, and PDF formats with advanced analysis",
    version="2.0.0"
)

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to specific domain for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure temp directory exists
TEMP_DIR = Path("backend/temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)

# Supported file types
SUPPORTED_EXTENSIONS = {'.csv', '.xlsx', '.xls', '.pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type: {file_extension}. Supported types: {', '.join(SUPPORTED_EXTENSIONS)}"
        )
    
    # Check file size (this is approximate as we haven't read the file yet)
    if hasattr(file, 'size') and file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Enhanced Statement Processor API",
        "version": "2.0.0",
        "supported_formats": list(SUPPORTED_EXTENSIONS),
        "max_file_size_mb": MAX_FILE_SIZE // (1024*1024),
        "endpoints": {
            "process_statement": "/process_statement",
            "health": "/health",
            "file_info": "/file_info"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running"}

@app.post("/file_info")
async def get_file_info(file: UploadFile = File(...)):
    """Get basic information about uploaded file without processing"""
    try:
        validate_file(file)
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_filepath = temp_file.name
        
        try:
            # Get file info using the processor
            processor = StatementProcessor()
            file_type = processor.detect_file_type(temp_filepath)
            
            # Get file size
            file_size = os.path.getsize(temp_filepath)
            
            return {
                "filename": file.filename,
                "file_type": file_type.value,
                "file_size_bytes": file_size,
                "file_size_mb": round(file_size / (1024*1024), 2),
                "supported": True
            }
            
        finally:
            # Clean up temp file
            if os.path.exists(temp_filepath):
                os.remove(temp_filepath)
                
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting file info: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing file info: {str(e)}")

@app.post("/process_statement")
async def process_statement_endpoint(
    file: UploadFile = File(...),
    salary: float = Form(0),
    currency: str = Form('NGN')
):
    """
    Process bank statement file and return comprehensive financial analysis
    
    Args:
        file: Bank statement file (CSV, Excel, or PDF)
        salary: Additional salary to include in income calculation
        currency: Currency code (default: NGN)
    
    Returns:
        Comprehensive financial analysis including:
        - Summary statistics
        - Spending breakdowns
        - Transaction highlights
        - Recurring transactions
        - Spending patterns
        - All transactions
    """
    temp_filepath = None
    
    try:
        # Validate file
        validate_file(file)
        logger.info(f"Processing file: {file.filename}")
        
        # Validate currency
        if not currency or len(currency) != 3:
            raise HTTPException(status_code=400, detail="Currency must be a 3-letter code (e.g., NGN, USD)")
        
        # Validate salary
        if salary < 0:
            raise HTTPException(status_code=400, detail="Salary cannot be negative")
        
        # Create temporary file with secure filename
        file_extension = Path(file.filename).suffix.lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            # Copy file content
            shutil.copyfileobj(file.file, temp_file)
            temp_filepath = temp_file.name
        
        # Check actual file size after writing
        file_size = os.path.getsize(temp_filepath)
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large: {file_size // (1024*1024)}MB. Maximum: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Process the statement
        processor = StatementProcessor(currency=currency.upper())
        result = processor.process_statement(temp_filepath, salary=salary)
        
        # Parse the JSON result
        try:
            parsed_result = json.loads(result)
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            raise HTTPException(status_code=500, detail="Error parsing processed data")
        
        # Check if there was an error in processing
        if "error" in parsed_result:
            logger.warning(f"Processing error: {parsed_result['error']}")
            raise HTTPException(status_code=400, detail=parsed_result["error"])
        
        # Add processing metadata
        parsed_result["processing_info"] = {
            "original_filename": file.filename,
            "file_size_bytes": file_size,
            "file_size_mb": round(file_size / (1024*1024), 2),
            "salary_included": salary,
            "currency": currency.upper()
        }
        
        logger.info(f"Successfully processed {file.filename}")
        return JSONResponse(content=parsed_result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing statement: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing statement: {str(e)}")
    
    finally:
        # Clean up temporary file
        if temp_filepath and os.path.exists(temp_filepath):
            try:
                os.remove(temp_filepath)
                logger.info(f"Cleaned up temporary file: {temp_filepath}")
            except Exception as e:
                logger.warning(f"Could not remove temporary file {temp_filepath}: {e}")

@app.post("/analyze_transactions")
async def analyze_transactions_endpoint(
    file: UploadFile = File(...),
    analysis_type: str = Form("summary"),
    currency: str = Form('NGN')
):
    """
    Analyze transactions with specific focus areas
    
    Args:
        file: Bank statement file
        analysis_type: Type of analysis (summary, spending, recurring, patterns)
        currency: Currency code
    
    Returns:
        Focused analysis based on requested type
    """
    temp_filepath = None
    
    try:
        validate_file(file)
        
        # Validate analysis type
        valid_types = ["summary", "spending", "recurring", "patterns"]
        if analysis_type not in valid_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid analysis type. Must be one of: {', '.join(valid_types)}"
            )
        
        # Create temporary file
        file_extension = Path(file.filename).suffix.lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_filepath = temp_file.name
        
        # Process the statement
        processor = StatementProcessor(currency=currency.upper())
        result = processor.process_statement(temp_filepath, salary=0)
        parsed_result = json.loads(result)
        
        if "error" in parsed_result:
            raise HTTPException(status_code=400, detail=parsed_result["error"])
        
        # Return focused analysis
        if analysis_type == "summary":
            focused_result = {
                "file_info": parsed_result.get("file_info", {}),
                "summary": parsed_result.get("summary", {}),
                "breakdowns": parsed_result.get("breakdowns", {})
            }
        elif analysis_type == "spending":
            focused_result = {
                "spending_breakdown": parsed_result.get("breakdowns", {}).get("spending_by_category", {}),
                "highest_expense": parsed_result.get("highlights", {}).get("highest_expense", {}),
                "spending_patterns": parsed_result.get("analysis", {}).get("spending_patterns", {})
            }
        elif analysis_type == "recurring":
            focused_result = {
                "recurring_transactions": parsed_result.get("highlights", {}).get("recurring_transactions", []),
                "summary": {
                    "total_recurring_amount": sum(
                        t.get("amount", 0) for t in parsed_result.get("highlights", {}).get("recurring_transactions", [])
                    ),
                    "recurring_count": len(parsed_result.get("highlights", {}).get("recurring_transactions", []))
                }
            }
        elif analysis_type == "patterns":
            focused_result = {
                "spending_patterns": parsed_result.get("analysis", {}).get("spending_patterns", {}),
                "average_daily_spending": parsed_result.get("analysis", {}).get("average_daily_spending", 0),
                "most_frequent_category": parsed_result.get("analysis", {}).get("most_frequent_category", "")
            }
        
        return JSONResponse(content=focused_result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in transaction analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing transactions: {str(e)}")
    
    finally:
        if temp_filepath and os.path.exists(temp_filepath):
            try:
                os.remove(temp_filepath)
            except Exception as e:
                logger.warning(f"Could not remove temporary file: {e}")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": str(pd.Timestamp.now())
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler for unexpected errors"""
    logger.error(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again.",
            "status_code": 500
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)