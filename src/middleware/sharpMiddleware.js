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
      return next(); // Skip if no file is uploaded
    }
    try {
      const inputPath = req.file.path; // Temporary file path from Multer
      const filename = path.parse(req.file.filename).name; // Get filename without extension
      const outputPath = path.join(
        "src/uploads",
        `${filename}.${outputFormat}`
      );

      // Process the image
      await sharp(inputPath)
        .resize(800) // Resize to max width of 800px (maintains aspect ratio)
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
      // If something goes wrong, delete the temporary file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  };
};

module.exports = sharpMiddleware; 