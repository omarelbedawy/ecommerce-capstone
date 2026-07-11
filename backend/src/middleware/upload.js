const multer = require('multer');
const path = require('path');
const os = require('os');

// Vercel's filesystem is read-only except /tmp - files written there don't
// persist between requests, but at least the upload won't crash the server.
// Locally and on a normal server (Docker, etc.) this just uses the real uploads folder.
const uploadDir = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpeg, png and webp images are allowed'));
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5mb cap

module.exports = upload;
