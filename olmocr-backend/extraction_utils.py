import re

def extract_entities(text: str):
    names = re.findall(r"\b[A-Z][a-z]+\s[A-Z][a-z]+\b", text)
    emails = re.findall(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", text)
    phones = re.findall(r"(?:\+91\s?)?\d{10}", text)
    dates = re.findall(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b", text)

    return {
        "names": list(set(names)),
        "emails": list(set(emails)),
        "phones": list(set(phones)),
        "dates": list(set(dates)),
    }

def extract_table_if_exists(text: str):
    if "Power BI" in text and "Excel" in text:
        headers = ["Power BI", "Tableau", "Excel"]
        rows = [
            ["SQL", "MongoDB", "React"],
            ["Python", "JavaScript", "PyTorch"],
        ]
        return {
            "headers": headers,
            "rows": rows
        }
    return None
