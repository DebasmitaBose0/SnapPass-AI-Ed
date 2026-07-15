export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file received. Please attach a JPEG, PNG, or WebP photo.',
      });
    }

    const { filename, size, mimetype } = req.file;
    const meta = req.imageMeta || {};

    return res.status(200).json({
      success: true,
      message: 'Photo uploaded and validated successfully.',
      data: {
        filename,
        fileSize: size,
        mimeType: mimetype,
        width: meta.width ?? null,
        height: meta.height ?? null,
        processUrl: `/api/process`,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const batchUpload = async (req, res, next) => {
  try {
    const files = req.files || [];
    const results = files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      mimeType: f.mimetype,
      width: f.imageMeta?.width ?? null,
      height: f.imageMeta?.height ?? null,
      uploaded: true,
    }));

    res.status(200).json({
      success: true,
      message: `${results.length} file(s) uploaded and validated successfully`,
      files: results,
    });
  } catch (err) {
    next(err);
  }
};
