const sqlConfig3 = require('../../database/config3');
const sql = require("mssql")

async function InsertGuard (req,res) {
    const Location = req.body.location;
    const Guardname = req.body.Guardname;
    const Guardid = req.body.Guardid;
    const Phoneno = req.body.Phoneno;
    const vendorid = req.body.vendorid;
    const vendorname = req.body.vendorname;
    const Guardjoiningdate= req.body.Guardjoiningdate;
    const LocationName = req.body.LocationName;
    const DateOfBirth = req.body.DateOfBirth;
    const Shift = req.body.Shift;

    try {
        const pool = new sql.ConnectionPool(sqlConfig3);
        await pool.connect();
     const result = await pool.query(`insert into NEWAWLDB.dbo.tbl_guardmaster (Location,Guardname,Guardid,Phoneno,vendorid,vendorname,Status,Guardjoiningdate,entrydate,entryby,Guard_status,locationname,DateOfBirth,Shift) 
      values('${Location}','${Guardname}','${Guardid}',${Phoneno},'${vendorid}','${vendorname}','Active','${Guardjoiningdate}',getdate(),'amn01','newjoin','${LocationName}','${DateOfBirth}','${Shift}')`)
      await pool.close()  
      console.log(result) 
      res.send('Added')
  }
  catch (err) {
    console.log(err)
  }
}

async function TotalGuards (req,res){

    try{
        const pool = new sql.ConnectionPool(sqlConfig3);
        await pool.connect();
        const result = await pool.query(`select * from NEWAWLDB.dbo.tbl_guardmaster`)
        await pool.close() 
        res.send(result.recordset)
    }
    catch (err){
        console.log(err)
    }
}

async function DeactiveGuards (req,res){
    const sno = req.body.sno;
    const status = req.body.status;
    try{
        const pool = new sql.ConnectionPool(sqlConfig3);
        await pool.connect();
        const result = await pool.query(`update NEWAWLDB.dbo.tbl_guardmaster set Status='${status}'where ID = ${sno}`)
        await pool.close() 
        res.send('done')
    }
    catch (err){
        console.log(err)
    }
}

async function ActiveLocation (req,res){
    try{
        const pool = new sql.ConnectionPool(sqlConfig3);
        await pool.connect();
        const result = await pool.query(`select WHid,WHname  from tbl_whmaster where whactive=1 order by WHname`)
        await pool.close() 
        res.send(result.recordset)
    }
    catch (err){
        console.log(err)
    }
} 

async function Updateguardmaster (req,res) {
    const status = req.body.status;
    const guardId = req.body.guardId;
    try{
        const pool = new sql.ConnectionPool(sqlConfig3);
        await pool.connect();
        const result = await pool.query(`update tbl_whmaster set Guard_status='${status}' where Guardid='${guardId}'`)
        await pool.close() 
        res.send('Updated')
    }
    catch(err){
        console.log(err);
    }
}

async function GetguardmasterLogout (req,res){
    try{
        const pool = new sql.ConnectionPool(sqlConfig3);
        await pool.connect();
        const result = await pool.query(`select * from tbl_guardmaster where Status = 'Active' and Guard_status ='Logout' or Guard_status ='newjoin'`)
        await pool.close() 
        res.send(result.recordset)

    }
    catch (err){
        console.log(err)
    }
}
async function GetguardmasterLogin (req,res){
    try{
        const pool = new sql.ConnectionPool(sqlConfig3);
        await pool.connect();
        const result = await pool.query(`select *,convert(varchar(15),Guardjoiningdate,23) as Logindate from tbl_guardmaster where Status = 'Active' and  Guard_status ='Login'`)
        await pool.close() 
        res.send(result.recordset)

    }
    catch (err){
        console.log(err)
    }
}

  module.exports={InsertGuard,TotalGuards,DeactiveGuards,ActiveLocation,Updateguardmaster,GetguardmasterLogout,GetguardmasterLogin}