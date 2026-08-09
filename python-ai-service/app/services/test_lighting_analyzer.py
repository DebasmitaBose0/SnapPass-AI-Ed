from app.services.lighting_analyzer import analyze_facial_lighting
from app.services.background_uniformity import analyze_background_uniformity

def test_analyze_facial_lighting_empty():
    result = analyze_facial_lighting(b"")
    assert result["score"] == 0.0
    assert result["has_glare"] is False

def test_analyze_facial_lighting_valid():
    result = analyze_facial_lighting(b"fake_image_bytes")
    assert result["score"] > 80.0
    assert result["symmetry_percentage"] > 90.0

def test_analyze_background_uniformity_valid():
    result = analyze_background_uniformity(b"fake_image_bytes")
    assert result["is_plain"] is True
    assert result["uniformity_score"] > 90.0
