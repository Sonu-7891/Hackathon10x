import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.size > 10 * 1024 * 1024) {
    return cb(new Error("File size exceeds 10MB"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
