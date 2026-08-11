"""
test_head_pose_estimator.py — Head Pose Estimator Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
from app.services.head_pose_estimator import estimate_head_pose_angles

def test_estimate_head_pose():
    mock_landmarks = [[10, 0, 0], [10, 0, 0], [0, 5, 0], [0, 5, 0], [0, 0, 2], [0, 0, 2]]
    res = estimate_head_pose_angles(mock_landmarks)
    assert res["valid"] is True
    assert res["yaw"] == 0.0