const fs = require('fs');

const directoryPath = './'; // Change this if your repository is in a different directory

let totalSize = 0;

function getFileSize(path) {
  const stat = fs.statSync(path);
  if (stat.isFile()) {
    totalSize += stat.size;
  } else if (stat.isDirectory()) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
      getFileSize(`${path}/${file}`);
    });
  }
}

getFileSize(directoryPath);

console.log(`Total repository size: ${formatSize(totalSize)}`);

// Helper function to format size for display
function formatSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let formattedSize = size;
  let unitIndex = 0;

  while (formattedSize >= 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }

  return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
}
