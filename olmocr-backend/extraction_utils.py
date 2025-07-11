# import re

# def extract_entities(text: str):
#     names = re.findall(r"\b[A-Z][a-z]+\s[A-Z][a-z]+\b", text)
#     emails = re.findall(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", text)
#     phones = re.findall(r"(?:\+91\s?)?\d{10}", text)
#     dates = re.findall(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b", text)

#     return {
#         "names": list(set(names)),
#         "emails": list(set(emails)),
#         "phones": list(set(phones)),
#         "dates": list(set(dates)),
#     }
import re
import spacy
from geotext import GeoText

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

def extract_addresses(text: str):
    doc = nlp(text)
    geo_places = GeoText(text)
    addresses = []

    for ent in doc.ents:
        if ent.label_ in ["GPE", "FAC", "LOC", "ADDRESS"]:
            addresses.append(ent.text)

    # Add cities and countries detected by GeoText
    addresses.extend(geo_places.cities)
    addresses.extend(geo_places.countries)

    return list(set(addresses))


def extract_entities(text: str):
    names = re.findall(r"\b[A-Z][a-z]+\s[A-Z][a-z]+\b", text)
    emails = re.findall(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", text)
    phones = re.findall(r"(?:\+91\s?)?\d{10}", text)
    dates = re.findall(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b", text)
    addresses = extract_addresses(text)

    return {
        "names": list(set(names)),
        "emails": list(set(emails)),
        "phones": list(set(phones)),
        "dates": list(set(dates)),
        "addresses": addresses
    }

def extract_table_if_exists(text: str):
    """
    Extracts a simple table from text if one exists.
    Returns a dictionary with headers and rows.
    """
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Try to find a potential table: look for lines with multiple words separated by consistent spacing
    table_lines = [line for line in lines if len(line.split()) >= 2]

    if len(table_lines) >= 2:
        headers = table_lines[0].split()
        rows = [line.split() for line in table_lines[1:]]
        
        # Make sure all rows match the header length
        rows = [row for row in rows if len(row) == len(headers)]

        return {
            "headers": headers,
            "rows": rows
        }

    return None
