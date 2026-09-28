const path = require("path");
const fs = require("fs");

const STORAGE_ROOT = path.join(__dirname, "..", "storage");

function getUserRoot(userId) {
    const userRoot = path.join(STORAGE_ROOT, String(userId));
    if (!fs.existsSync(userRoot)) {
        fs.mkdirSync(userRoot, { recursive: true });
    }
    return userRoot;
}

// Resolves a client-supplied relative path to an absolute path inside
// that user's storage root, and throws if it tries to escape it
// (blocks "../../etc" style traversal).
function resolveUserPath(userId, relativePath = "") {
    const userRoot = getUserRoot(userId);
    const target = path.normalize(path.join(userRoot, relativePath || ""));

    if (target !== userRoot && !target.startsWith(userRoot + path.sep)) {
        throw new Error("Invalid path");
    }
    return target;
}

module.exports = { getUserRoot, resolveUserPath, STORAGE_ROOT };