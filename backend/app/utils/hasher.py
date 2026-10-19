import hashlib
import os
from typing import Tuple

def calculate_sha256_bytes(content: bytes) -> str:
    """Computes SHA-256 hex digest of byte content."""
    hasher = hashlib.sha256()
    hasher.update(content)
    return hasher.hexdigest()

def calculate_file_sha256(filepath: str) -> str:
    """Computes SHA-256 hex digest of file on disk."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def generate_receipt_hash(app_number: str, emp_ref: str, timestamp_str: str) -> str:
    """Generates verifiable cryptographic receipt hash for promotion application."""
    token = f"FAIRGOV-RECEIPT::{app_number}::{emp_ref}::{timestamp_str}"
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def generate_identity_hash(name: str, dob_str: str, dept: str) -> str:
    """
    Generates a deterministic identity hash used to flag potential duplicate employee entries
    without storing cleartext sensitive national identifiers.
    """
    normalized = f"{name.strip().lower()}::{dob_str}::{dept.strip().lower()}"
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()
