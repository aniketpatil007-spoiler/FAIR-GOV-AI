import pytest
from backend.app.utils.hasher import (
    calculate_sha256_bytes, generate_receipt_hash, generate_identity_hash
)

def test_calculate_sha256_bytes():
    data = b"Government Employee Service Document"
    hash1 = calculate_sha256_bytes(data)
    hash2 = calculate_sha256_bytes(data)
    assert len(hash1) == 64
    assert hash1 == hash2

    different_data = b"Government Employee Service Document (Altered)"
    assert calculate_sha256_bytes(different_data) != hash1

def test_generate_receipt_hash():
    receipt1 = generate_receipt_hash("APP-2024-001", "EMP-100", "2024-01-01T10:00:00Z")
    receipt2 = generate_receipt_hash("APP-2024-001", "EMP-100", "2024-01-01T10:00:00Z")
    assert len(receipt1) == 64
    assert receipt1 == receipt2

def test_generate_identity_hash_duplicate_detection():
    id_hash1 = generate_identity_hash("Aniket Sharma", "1988-07-14", "Ministry of Home Affairs")
    # Same name with different casing / whitespace should produce identical normalized hash
    id_hash2 = generate_identity_hash("  aniket sharma ", "1988-07-14", "MINISTRY OF HOME AFFAIRS  ")
    assert id_hash1 == id_hash2

    # Different person
    id_hash3 = generate_identity_hash("Vikram Rathore", "1985-04-10", "DoPT")
    assert id_hash1 != id_hash3
