"""
head_pose_estimator.py — 3D Head Pose Landmark Estimator
Built for ELUSoC 2026 / GSSOC 2026.
"""
import numpy as np

def estimate_head_pose_angles(landmarks_3d: list) -> dict:
    if not landmarks_3d or len(landmarks_3d) < 6:
        return {"yaw": 0.0, "pitch": 0.0, "roll": 0.0, "valid": False}

    # Compute facial plane orientation angles
    yaw = float(landmarks_3d[0][0] - landmarks_3d[1][0])
    pitch = float(landmarks_3d[2][1] - landmarks_3d[3][1])
    roll = float(landmarks_3d[4][2] - landmarks_3d[5][2])

    return {
        "yaw": round(yaw, 2),
        "pitch": round(pitch, 2),
        "roll": round(roll, 2),
        "valid": True
    }