const sqlConfig = require('../database/config');
const jwt = require('jsonwebtoken');
const sql = require("mssql");
const sqlConfig1 = require('../database/config1')

async function Vendordata(req,res){
  const {name,password} = req.body;
  console.log(name,password)
  try {
    await sql.connect(sqlConfig)
    if (!name || !password) {
      return res.status(401).json({
        message: !name ? `Please Enter Name` :  `Please Enter Password`
      })
    }
    const result = await sql.query(`select UID,uPWD,uName,CUST_ID,cust_name from User_Rights where CUST_ID='${name}' and uPWD='${password}'`);
    if(result.recordset[0]) {
      const token = jwt.sign({ name, password }, process.env.JWT_KEY, { expiresIn: 5 * 24 * 60 * 60 })
      res.status(200).send({
        status:"Success",
        token,
        ...result.recordset[0]
      })
    }else{
      res.status(401).send({
        status:"Fail"
      })
    }
  } catch (err) {
    console.log(`ERROR OCCURRED ${err}`)
  }
}

  async function Vendorget(req,res) {
    const id = req.query.id;
    try {
      await sql.connect(sqlConfig)
      const result= await sql.query(`select tid,tname,tadd,tcity,Tstate,Tpin,Tcountry,Tcontactperson,Tcontactno,temail,tpan,tcst as GSTNO from tbl_transporter where Tid='${id}'`)
      if(result){
      res.send(result.recordset[0])
    }
    }
    catch (err) {
      console.log(`Error occured ${err}`)
    }
  }
  


  async function UpdateVendor(req,res) {
    const{tid,tadd,tcity,Tstate,Tpin,Tcountry,Tcontactperson,Tcontactno,temail,tpan,tcst} = req.body
    try{
      const pool = new sql.ConnectionPool(sqlConfig);
      await pool.connect();
      const data = await pool.query(`UPDATE tbl_transporter SET tadd='${tadd?tadd:''}',tcity='${tcity?tcity:''}',Tstate='${Tstate?Tstate:''}',Tpin='${Tpin?Tpin:''}',Tcountry='${Tcountry?Tcountry:''}',Tcontactperson='${Tcontactperson?Tcontactperson:''}',Tcontactno='${Tcontactno?Tcontactno:''}',temail='${temail?temail:''}',tpan='${tpan?tpan:''}',tcst='${tcst?tcst:''}'  WHERE Tid='${tid?tid:''}'`)
      await pool.close()  
      res.send(`Data Updated`)
       }
    catch(err){
        console.log(`Error occured ${err}`)
    }  
  }

  async function InvoicesOffset(req,res) {
    const cid = req.body.cid;
  try{
    const pool = new sql.ConnectionPool(sqlConfig1);
    await pool.connect();   
        const data =  await pool.query(`SELECT  [INV_NO],convert(varchar(15),INV_DATE,106) as INV_DATE,cast(convert(decimal(10,2),INV_AMT) as nvarchar) as INV_AMT,cast(convert(decimal(10,2),tds_amt) as nvarchar) as tds_amt FROM FINS_PJ_DIRECT where AC_NAME='${cid}' and company='awl'
                                   ORDER by INV_DATE ASC `)
        const countData =  await pool.query(`select COUNT(*) as total_row FROM FINS_PJ_DIRECT where AC_NAME='${cid}' and company='AWL'`)
    await pool.close()
    res.status(200).send({data:data.recordsets[0],Count:countData.recordset})
  }
    catch(err){
    console.log(`The Error is ${err}`)
  }
  }

  async function PendingInvoices(req,res) {
    const cust_id = req.body.cust_id;
 
    try{
      const pool = new sql.ConnectionPool(sqlConfig1);
      await pool.connect();   
      const data = await pool.query(`select INV_NO,convert(varchar(15),INV_DATE,106) as INV_DATE,cast(convert(decimal(10,2),INV_AMT) as nvarchar) as INV_AMT from FINS_PJ_DIRECT where AC_NAME='${cust_id}' and
      INV_NO not in (select distinct vendor_inv_no from FINS_BANK_BOOK_SUB where ptym_to='${cust_id}') order by PJ_DATE asc`)

      const countData = await pool.query(`select COUNT( * ) as total from FINS_PJ_DIRECT where AC_NAME='${cust_id}' and 
                       INV_NO not in (select distinct vendor_inv_no from FINS_BANK_BOOK_SUB where ptym_to='${cust_id}')`)
      await pool.close()
      res.status(200).send({data:data.recordsets[0],Count:countData.recordset})
    }
    catch(err){
          res.send(err)
    }
  }

  async function InvoicePractice(req,res) {
    const cid = req.body.cid;
    const pageNumber = req.body.pageNumber;
    const RowsPerPage = 10;
    const Inv_Date=req.body.Inv_Date;
    const Inv_Amt=req.body.Inv_Amt;
    if(!Inv_Date){
    var update_date = Inv_Amt
                }
    else if(!Inv_Amt){
    var update_date = Inv_Date
                     }
  else{
    var update_date = Inv_Date
      }
  try{ 
    const pool = new sql.ConnectionPool(sqlConfig1);
    await pool.connect();   
        const data =  await pool.query(`SELECT  [INV_NO],[INV_DATE],[INV_AMT],[tds_amt] FROM FINS_PJ_DIRECT where AC_NAME='${cid}' and company='awl'
                      ORDER by ${update_date} ASC OFFSET (${pageNumber}-1) * ${RowsPerPage} ROWS FETCH NEXT  ${RowsPerPage} ROWS ONLY `)
    const countData =  await pool.query(`select COUNT(*) as total_row FROM FINS_PJ_DIRECT where AC_NAME='${cid}' and company='awl'`)
    console.log(data)
    await pool.close()
        res.status(200).send({data:data.recordsets[0],pageNumber,Count:countData.recordset})
    }
    catch(err){
                console.log(`The Error is ${err}`)
              }
    }

  async function SearchInvoice(req,res){
        const InvoiceNo = req.body.INV_NO
        console.log(req.body)
        try{
          const pool = new sql.ConnectionPool(sqlConfig1);
          await pool.connect();   
          const data = await pool.query(`SELECT [INV_NO],[INV_DATE],[INV_AMT],[tds_amt] FROM FINS_PJ_DIRECT where INV_NO='${InvoiceNo}'`)
          await pool.close()
          res.send(data.recordsets[0])
        }
        catch(err){
          console.log(err)
        }
      }

      async function TotalInvoices(req,res) {
        const cid = req.query.cid
        try{
          const pool = new sql.ConnectionPool(sqlConfig1);
          await pool.connect();   
          const data = await pool.query(`SELECT [INV_NO],convert(varchar(15),INV_DATE,106) as INV_DATE,cast(convert(decimal(10,2),INV_AMT) as nvarchar) as INV_AMT,[tds_amt] FROM FINS_PJ_DIRECT where AC_NAME='${cid}' and company='awl' ORDER BY INV_DATE ASC `)
          await pool.close()
          res.send(data.recordset)
        }
        catch(err){
          console.log(err)
        }
      }

      async function InvoicesTotal(req,res) {
        const cid = req.body.cid;
        console.log(cid)
        const pageNumber = req.body.pageNumber;
        const RowsPerPage = 10;
        try{
          const pool = new sql.ConnectionPool(sqlConfig1);
          await pool.connect();  
          const data = await pool.query(`select INV_NO,convert(varchar(15),INV_DATE,106) as INV_DATE,cast(convert(decimal(10,2),INV_AMT) as nvarchar) as INV_AMT,iif((select count(distinct VENDOR_INV_NO) from FINS_BANK_BOOK_SUB where ptym_to='${cid}' and VENDOR_INV_NO=pj.inv_no)<>0,'Processed','In Process') as status from FINS_PJ_DIRECT pj where AC_NAME='${cid}' order by PJ_DATE asc
          OFFSET (${pageNumber}-1) * ${RowsPerPage} ROWS FETCH NEXT ${RowsPerPage} ROWS ONLY `)
          const countData = await pool.query(`select COUNT(DISTINCT VENDOR_INV_NO) as total_row FROM FINS_BANK_BOOK_SUB where PTYM_TO ='${cid}'`)
          await pool.close()
          res.status(200).send({data:data.recordset,Count:countData.recordset})
        }
        catch(err){
          console.log(err)
        }
      }
 
  module.exports = {Vendordata,Vendorget,UpdateVendor,InvoicesOffset,InvoicePractice,SearchInvoice,TotalInvoices,PendingInvoices,InvoicesTotal}