export async function checkImageDiagnostics(req, res) {
  return res.status(200).json({
    dimensions: 'Valid',
    faceDetected: true,
    blurMetric: 0.15,
  });
}
