const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

/**
 * Middleware to process and compress images using Sharp.
 * @param {string} outputFormat - The desired output format (e.g., "webp", "jpeg", "png").
 * @param {number} quality - The quality of the output image (0-100).
 * @returns {Function} - Express middleware function.
 */
const sharpMiddleware = (outputFormat = "webp", quality = 80) => {
  return async (req, res, next) => {
    if (!req.file) {
      return next();
    }
    try {
      const inputPath = req.file.path;
      const filename = path.parse(req.file.filename).name;
      const outputDir = path.join(__dirname, "../../uploads");

      // Ensure directory exists
      fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, `${filename}.${outputFormat}`);

      await sharp(inputPath)
        .resize(800)
        .toFormat(outputFormat, { quality })
        .toFile(outputPath);

      // Delete the original file
      fs.unlinkSync(inputPath);

      // Update req.file to reflect the new processed image
      req.file.filename = `${filename}.${outputFormat}`;
      req.file.path = outputPath;
      req.file.mimetype = `image/${outputFormat}`;

      next();
    } catch (error) {
      console.error("Sharp middleware error:", error);
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
      }
      next(error);
    }
  };
};

module.exports = sharpMiddleware;
