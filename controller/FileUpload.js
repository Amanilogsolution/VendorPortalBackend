const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline,
  } = require("@azure/storage-blob");
  const uuidv1 = require("uuid/v1");

  const accountName = 'anyspaze';
const accountKey = 'n5wgNaMsPRW5TfCC0x6AE3py5jwDy5PkzxdtskfaM/XRYkeiYjqc62FmsOj8ii6fGp2MtOB3m8WmZnwcz5oAHw==';
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey,
);

const pipeline = newPipeline(sharedKeyCredential);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  pipeline,
);
const uploadOptions = { bufferSize: 4 * 1024 * 1024, maxConcurrency: 20 };
const getStream = require("into-stream");
const contanierName = "awlvendorportal";

const fileUpload =  async (req, res,next) => {
  let images = [];
  console.log(req.body)
  try {
    await req.files.forEach(async (reqfile, i) => {
      const blobName =  uuidv1() + "-" + reqfile.originalname;
      images.push(blobName)
      const stream = getStream(reqfile.buffer);
      const containerClient = blobServiceClient.getContainerClient(
        contanierName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

     let resdata = await blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxConcurrency,
        { blobHTTPHeaders: { blobContentType: reqfile.mimetype } },
      );
    });
        // console.log(`https://anyspaze.blob.core.windows.net/awlvendorportal/`+images[0])
        const Upload = `https://anyspaze.blob.core.windows.net/awlvendorportal/`+images[0];

    res.status(200).send(Upload)

  } catch (err) {
    console.log(err)
  }
}

module.exports = fileUpload