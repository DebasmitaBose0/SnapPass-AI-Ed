/**
 * headPoseEstimator.service.js — Biometric 3D Head Pose Yaw/Pitch/Roll Estimator
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class HeadPoseEstimatorService {
  static evaluateAngles(yaw, pitch, roll) {
    const isYawCompliant = Math.abs(yaw) <= 5.0;
    const isPitchCompliant = Math.abs(pitch) <= 5.0;
    const isRollCompliant = Math.abs(roll) <= 3.0;

    const isCompliant = isYawCompliant && isPitchCompliant && isRollCompliant;
    const warnings = [];

    if (!isYawCompliant) warnings.push(`YAW_OUT_OF_BOUNDS (${yaw} deg)`);
    if (!isPitchCompliant) warnings.push(`PITCH_OUT_OF_BOUNDS (${pitch} deg)`);
    if (!isRollCompliant) warnings.push(`ROLL_OUT_OF_BOUNDS (${roll} deg)`);

    return {
      isCompliant,
      angles: { yaw, pitch, roll },
      warnings,
    };
  }
}
