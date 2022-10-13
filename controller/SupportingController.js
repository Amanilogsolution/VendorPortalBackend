const sqlConfig = require('../database/config');
const sql = require("mssql");

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

const AddSupporting =  async (req, res,next) => {
  let images = [];
  try {
    await req.files.forEach(async (reqfile, i) => {
      const blobName =  uuidv1() + "-" + reqfile.originalname;
      images.push(blobName)
      const stream = getStream(reqfile.buffer);
      const containerClient = blobServiceClient.getContainerClient(
        contanierName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      var Upload = blockBlobClient.url

     let resdata = await blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxConcurrency,
        { blobHTTPHeaders: { blobContentType: reqfile.mimetype }},
      );
            

      await sql.connect(sqlConfig);
      const result = await sql.query(`Insert into tbl_VendorSupporting (Reference_Number,Reference_Type,Upload_Date,Upload_Document,Status,Entryby) 
      Values('${req.body.Reference_no}','${req.body.Referance_Type}',GETDate(),'${Upload}','ref_uploaded','indev')`);
    });
    // console.log(`https://anyspaze.blob.core.windows.net/awlvendorportal/`+images[0])
    res.status(200).send('Done'); 
  } catch (err) {
    console.log(err)
  }
}

const getSupplorting = async (req,res) =>{
  
  try{
    await sql.connect(sqlConfig);
     const result = await sql.query(`SELECT Sno,Reference_Number,Reference_Type,convert(varchar(15),Upload_Date,106) as Upload_Date ,Invoice_Number,Upload_Document from tbl_VendorSupporting tvs where Status='ref_uploaded' 
                                      order by Sno desc`)
     const countData = await sql.query(`select COUNT(*) as total_row from tbl_VendorSupporting tvs where Status = 'ref_uploaded'`)
     res.send({data:result.recordsets[0],count:countData.recordset})
  }
  catch(err){
        console.log(err)
  }
}


const ReUploadDocument =  async (req, res) => {
  const Sno = req.body.Sno;
  const Upload_Document = req.body.Upload_Document;
  console.log(`hello`,Sno,Upload_Document)
  try {
      await sql.connect(sqlConfig);
      const result = await sql.query(`UPDATE tbl_VendorSupporting set Upload_Document='${Upload_Document}' WHERE Sno = '${Sno}'`);
      res.status(200).send(result)
  } catch (err) {
    console.log(err)
  }
}

const DeleteSupporting = async (req,res) =>{
  const Sno = req.body.Sno;
  console.log(Sno)
  try{
      await sql.connect(sqlConfig);
        const result = await sql.query(`DELETE from tbl_VendorSupporting WHERE Sno = '${Sno}'`)
        res.status(200).send('Data Deleted')
  }
  catch(err){
    console.log(err)
  }
}

const InsertInvoices =  async (req, res,next) => {
  let images = [];
  console.log(req.files)
  try {
    await req.files.forEach(async (reqfile, i) => {
      const blobName =  uuidv1() + "-" + reqfile.originalname;
      images.push(blobName)
      const stream = getStream(reqfile.buffer);
      const containerClient = blobServiceClient.getContainerClient(
        contanierName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      console.log(blockBlobClient.url)
      var Upload_Document = blockBlobClient.url

     let resdata = await blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxConcurrency,
        { blobHTTPHeaders: { blobContentType: reqfile.mimetype }},
      );

      await sql.connect(sqlConfig);
      const result = await sql.query(`INSERT INTO Tbl_VendorAdded(Invoice_Number, Invoice_Date, Invoice_Amount, Upload_Invoice, Upload_CoverLetter, status, Invoice_status, All_Invoices)
      VALUES('${req.body.Invoice_Number}', GETDate(), ${req.body.Invoice_Amount}, '${Upload_Document}', 'awss', 'ref_uploaded', 'inv_uploaded', 'qwe')`);
    });
        console.log(`https://anyspaze.blob.core.windows.net/awlvendorportal/`+images[0])
    res.status(200).send('Done'); 

  } catch (err) {
    console.log(err)
  }
}

const deleteBlob = async (req,res,next) => {
  const link = req.body.link;
  console.log(link)
  const blobName = link.replace('https://anyspaze.blob.core.windows.net/awlvendorportal/','')
  console.log(blobName)
try {
  const containerClient = await blobServiceClient.getContainerClient(contanierName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  const blobDeleteResponse = blockBlobClient.delete();
  res.send(await blobDeleteResponse); 
   }catch(err){
  res.send(err)
}
}

const ShowSupporting = async (req,res) => {
  try{
     await sql.connect(sqlConfig);
    const result = await sql.query(`select (Reference_Number) from tbl_VendorSupporting tvs where Invoice_Number is null `)
    res.send(result.recordset)
  }
  catch(err){
    console.log(err)
  }
}

const UpdateInvoiceSupporting = async(req,res) => {
const invoiceNo = req.body.invoiceNo;
const ReferanceNo = req.body.ReferanceNo;
try{
    await sql.connect(sqlConfig)
    const result = await sql.query(`update tbl_VendorSupporting set Invoice_Number ='${invoiceNo}' WHERE Reference_Number ='${ReferanceNo}'`)
    res.status(200).send(result)
}
catch(err){
  console.log(err)
}
}

const SupportingEdit = async(req,res) => {
  const ReferanceNo = req.body.ReferanceNo;
  try{
      await sql.connect(sqlConfig)
      const result = await sql.query(` select * from tbl_VendorSupporting tvs WHERE Reference_Number ='${ReferanceNo}'`)
      res.status(200).send(result.recordset)
  }
  catch(err){
    console.log(err)
  }
}



module.exports = {AddSupporting,getSupplorting,DeleteSupporting,ReUploadDocument,InsertInvoices,deleteBlob,ShowSupporting,UpdateInvoiceSupporting,SupportingEdit}