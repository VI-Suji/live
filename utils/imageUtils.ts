export function getDirectImageUrl(url: string | undefined | null): string {
  if (!url) return "";

  // Google Drive
  // Match https://drive.google.com/file/d/ID/view... or just /d/ID
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  
  // Dropbox
  // Change dl=0 to raw=1
  if (url.includes("dropbox.com") && url.includes("dl=0")) {
    return url.replace("dl=0", "raw=1");
  }

  return url;
}
