const { BlobServiceClient } = require("@azure/storage-blob");

const AZURE_CONTAINER_NAME = "equity-pdf-reports"; // Your container
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_BLOB_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

async function uploadPdfToBlob(fileName, fileBuffer) {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: "application/pdf" }
    });

    console.log("📤 Uploaded to Azure Blob:", fileName);

    return blockBlobClient.url; // downloadable public URL (if container is public)
  } catch (error) {
    console.error("Azure Blob Upload Error:", error);
    throw error;
  }
}

module.exports = { uploadPdfToBlob };
