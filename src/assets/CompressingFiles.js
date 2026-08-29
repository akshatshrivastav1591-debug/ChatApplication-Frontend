  export async function CompressingFiles (file, quality = 0.7) {
const NON_COMPRESSIBLE = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', '7z'];
  if (file.type.startsWith("video/") || file.type === "application/pdf") {
    return file;
  }
  const getExtension = (file) => file.name.split('.').pop().toLowerCase();
  const ext = getExtension(file);
  if (NON_COMPRESSIBLE.includes(ext)) {
    return file;
  }

  // Image compression using Canvas
  if (file.type.startsWith("image/")) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            // If compressed is bigger than original, return original
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const compressedFile = new File([blob], file.name, { type: "image/jpeg" });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file); // fallback to original on error
      };
      img.src = objectUrl;
    });
  }

  // Non-image, non-video files (txt, csv, json etc.)
  if (typeof CompressionStream !== "undefined") {
    const stream = file.stream().pipeThrough(new CompressionStream("gzip"));
    const compressedBlob = await new Response(stream).blob();

    // If compressed is bigger than original, return original
    if (compressedBlob.size >= file.size) return file;

    return new File([compressedBlob], file.name + ".gz", { type: file.type });
  }

  return file;
}