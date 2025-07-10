import os
import re
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from transformers import AutoModel, AutoTokenizer
from PyPDF2 import PdfReader
import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import io
import mimetypes

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

# Optional: Use a real model here instead
model_path = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModel.from_pretrained(model_path)

# Set tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_pdf(path):
    text = ""
    with fitz.open(path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_image(file_bytes):
    image = Image.open(io.BytesIO(file_bytes))
    return pytesseract.image_to_string(image)

def extract_entities(text):
    names = re.findall(r"[A-Z][a-z]+ [A-Z][a-z]+", text)
    dates = re.findall(r"\b(?:\d{1,2}[-/th\s\.])?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/\s\.]?\d{2,4}|\b\d{4}[-/]\d{1,2}[-/]\d{1,2}", text)
    addresses = re.findall(r"\d{1,4} [A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Blvd)", text)
    return {
        "names": names[:5],
        "dates": dates[:5],
        "addresses": addresses[:5]
    }

def extract_table(text):
    lines = text.strip().split('\n')
    table_lines = [line for line in lines if "," in line or "\t" in line]
    table = {"headers": [], "rows": []}

    if len(table_lines) >= 2:
        split_char = "," if "," in table_lines[0] else "\t"
        table["headers"] = [h.strip() for h in table_lines[0].split(split_char)]
        for row in table_lines[1:]:
            table["rows"].append([c.strip() for c in row.split(split_char)])
    return table

@app.get("/")
def root():
    return {"message": "Welcome to the OlmOCR Backend!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_type = mimetypes.guess_type(file.filename)[0]

        # Save temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(contents)

        if file_type and file_type.startswith("image"):
            text = extract_text_from_image(contents)
        elif file_type and file_type == "application/pdf":
            text = extract_text_from_pdf(temp_path)
        else:
            os.remove(temp_path)
            return {"error": "Unsupported file type"}

        entities = extract_entities(text)
        table_data = extract_table(text)

        os.remove(temp_path)

        return {
            "filename": file.filename,
            "entities": entities,
            "table": table_data,
            "raw_text": text[:500] + "..." if len(text) > 500 else text
        }

    except Exception as e:
        return {
            "error": "Failed to process file",
            "details": str(e)
        }
