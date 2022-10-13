const sqlConfig = require('../database/config');
const sql = require("mssql");

async function AddInvoice(req,res){
    const Invoice_Number = req.body.Invoice_Number;
    const Invoice_Amount = req.body.Invoice_Amount;
    const Upload_Document = req.body.Upload_Document;
    const Upload_CoverLetter = req.body.Upload_CoverLetter
    // console.log(Upload_Document,Upload_CoverLetter)
    try {
      await sql.connect(sqlConfig)
      const result = await sql.query(`INSERT INTO Tbl_VendorAdded(Invoice_Number, Invoice_Date, Invoice_Amount, Upload_Invoice, Upload_CoverLetter, status, Invoice_status, All_Invoices)
      VALUES('${Invoice_Number}', GETDate(), ${Invoice_Amount}, '${Upload_Document}', '${Upload_CoverLetter}', 'ref_uploaded', 'inv_uploaded', 'qwe')`)
      res.status(200).send(result)   

    } catch (err) {
      console.log(`ERROR OCCURRED ${err}`)
    }
  }
  

  async function GetInvoices(req,res){
      try{
          await sql.connect(sqlConfig)
          const result = await sql.query(`SELECT SNo,Invoice_Number,convert(varchar(15),Invoice_Date,106) as Invoice_Date ,Invoice_Amount,status,Upload_Invoice from Tbl_VendorAdded tva2 where Invoice_status ='inv_uploaded' `)
          const count = await sql.query(`Select Count(*) as total_row from Tbl_VendorAdded`)
          res.status(200).send({result:result.recordsets[0],Count:count.recordset})
      }catch(err){
          res.send(err)
      }
  }

  async function GetInvoicesUpdate(req,res){
      const Sno = req.body.Sno
      try{
          await sql.connect(sqlConfig)
          const result = await sql.query(`select SNo,Invoice_Number,convert(varchar(15),Invoice_Date,23) as Invoice_Date ,Invoice_Amount,status,Invoice_status,All_Invoices from Tbl_VendorAdded tva where Sno = '${Sno}'`)
          res.status(200).send(result.recordsets[0])

      }catch(err){

      }
  }

  async function DeleteInvoice(req,res){
      const sno = req.body.sno
      try{
          await sql.connect(sqlConfig)
          const result = await sql.query(`delete from Tbl_VendorAdded where SNO = '${sno}'`)
          res.status(200).send("Deleted")
      }catch(err){
          res.send(err)
      }
  }
  const UpdateInvoice = async(req,res) => {
      const Invoice_date = req.body.Invoice_date;
      const Invoice_Amount = req.body.Invoice_Amount;
      const sno = req.body.sno;
      const Invoice_time = req.body.Invoice_time;
    //   console.log(req.body)

      try{
          await sql.connect(sqlConfig)
          const result = await sql.query(`Update Tbl_VendorAdded set Invoice_Date='${Invoice_date} ${Invoice_time}',Invoice_Amount='${Invoice_Amount}' WHERE SNo ='${sno}'`)
            res.status(200).send(result)
      }catch(err){
          console.log(err)
      }
  }

  const GetLR = async(req,res) => {
      const refernace_no = req.body.refernace_no;
      const lr = req.body.lr;
      const Referance_type = req.body.Referance_type;
    //   console.log(refernace_no,lr,Referance_type)

      try{
          await sql.connect(sqlConfig)
          const result = await sql.query(`Insert into tbl_VendorSupporting (Reference_Number,Reference_Type,Upload_Date,Upload_Document,Status,Entryby) 
          Values('${refernace_no}','${Referance_type}',GETDate(),'${lr}','ref_uploaded','indev')`)
          res.status(200).send('Supporting Inserted')
      }
      catch(err){
                console.log(err)
      }

  }

  module.exports = {AddInvoice,GetInvoices,DeleteInvoice,GetInvoicesUpdate,UpdateInvoice,GetLR}