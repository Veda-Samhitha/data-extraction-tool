import os
import re
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import io
from extraction_utils import extract_entities, extract_table_if_exists

load_dotenv()

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set tesseract path (adjust for your system)
# For Windows:
try:
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
except:
    # For Linux/Mac or if Windows path is different
    pass

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF using PyMuPDF"""
    text = ""
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        raise e
    return text

def extract_text_from_image(file_path: str) -> str:
    """Extract text from image using OCR"""
    try:
        image = Image.open(file_path)
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Use OCR to extract text
        text = pytesseract.image_to_string(image, config='--psm 6')
        return text
    except Exception as e:
        print(f"Error extracting text from image: {e}")
        raise e

@app.get("/")
def root():
    return {"message": "Universal PDF/Image Data Extraction API with OlmOCR"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and process PDF or image file to extract entities
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file type
    allowed_types = {
        'application/pdf': ['.pdf'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/gif': ['.gif'],
        'image/bmp': ['.bmp'],
        'image/tiff': ['.tiff', '.tif']
    }
    
    file_extension = os.path.splitext(file.filename)[1].lower()
    is_valid_type = any(
        file_extension in extensions 
        for extensions in allowed_types.values()
    )
    
    if not is_valid_type:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file type. Please upload PDF or image files."
        )
    
    # Check file size (10MB limit)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(
            status_code=400, 
            detail="File too large. Maximum size is 10MB."
        )
    
    # Save temporary file
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as f:
            f.write(contents)
        
        # Extract text based on file type
        extracted_text = ""
        if file_extension == '.pdf':
            extracted_text = extract_text_from_pdf(temp_path)
        else:
            extracted_text = extract_text_from_image(temp_path)
        
        if not extracted_text.strip():
            raise HTTPException(
                status_code=400, 
                detail="No text could be extracted from the file"
            )
        
        # Extract entities using improved functions
        entities = extract_entities(extracted_text)
        
        # Extract table if exists
        table = extract_table_if_exists(extracted_text)
        
        # Prepare response
        response = {
            "filename": file.filename,
            "entities": entities,
            "extracted_text": extracted_text[:1000] + "..." if len(extracted_text) > 1000 else extracted_text,
            "text_length": len(extracted_text),
            "extraction_summary": {
                "names_found": len(entities.get("names", [])),
                "phones_found": len(entities.get("phones", [])),
                "emails_found": len(entities.get("emails", [])),
                "addresses_found": len(entities.get("addresses", []))
            }
        }
        
        if table:
            response["table"] = table
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing file: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/extract-text-only")
async def extract_text_only(file: UploadFile = File(...)):
    """
    Extract only raw text from PDF or image (for debugging)
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    contents = await file.read()
    temp_path = f"temp_{file.filename}"
    
    try:
        with open(temp_path, "wb") as f:
            f.write(contents)
        
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension == '.pdf':
            text = extract_text_from_pdf(temp_path)
        else:
            text = extract_text_from_image(temp_path)
        
        return {
            "filename": file.filename,
            "extracted_text": text,
            "text_length": len(text)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error extracting text: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/test-extraction")
def test_extraction():
    """
    Test endpoint to verify extraction patterns with sample data
    """
    sample_texts = [
        # Resume format
        """
        JOHN SMITH
        Phone: +1-555-123-4567
        Email: john.smith@email.com
        Address: 123 Main Street, New York, NY 10001
        """,
        
        # Business card format
        """
        Dr. Sarah Johnson
        Senior Manager
        ABC Corporation
        sarah.johnson@abc.com
        Mobile: (555) 987-6543
        Office: 456 Business Ave, Suite 200, Los Angeles, CA 90210
        """,
        
        # Letter format
        """
        Dear Sir/Madam,
        
        I am writing to inquire about your services.
        
        Please contact me at:
        Email: customer@example.org
        Phone: 91-9876543210
        
        My address is:
        Flat 101, Green Valley Apartments
        Sector 15, Gurgaon, Haryana - 122001
        
        Sincerely,
        Michael Brown
        """
    ]
    
    results = []
    for i, text in enumerate(sample_texts):
        entities = extract_entities(text)
        results.append({
            f"sample_{i+1}": {
                "text": text.strip(),
                "entities": entities
            }
        })
    
    return {"test_results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)