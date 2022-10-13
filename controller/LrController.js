const sqlConfig = require('../database/config');
const sql = require("mssql");

async function LRStatus(req,res){
    try {
      await sql.connect(sqlConfig)
      const result = await sql.query(`select distinct [Status] from StatusMaster order by [status] asc`)
      res.status(200).send(result.recordsets[0])   
    } catch (err) {
      console.log(`ERROR OCCURRED ${err}`)
    }
  }

  async function LRData(req,res){
    const user_name = req.body.user_name;
    console.log('TotalLR',user_name)
    try {
      await sql.connect(sqlConfig)
      const result = await sql.query(`select distinct OutLRNo as LRNo,convert(varchar(15),OutLRDate,103) as OutLRDate,convert(date,outlrdate) as LrDate,OutGPNo as GatePass,c.Tname as Transporter,
      City,OutVehType as VehicleType,OutVehNo as VehicleNo,GPAllow,OutDriverNo,ShipmentStatus,DocketNo  
      from tbl_mdn m WITH(NOLOCK) left join tbl_transporter c with(nolock) on c.tid=m.outtpt where OutTransportBy='AWL' 
      AND isnull(ShipmentStatus,'')<>'Delivered'  AND ISNULL(OutLRNo,'')<>''   AND ISNULL(OutgpNo,'')<>''
      and convert(date,outlrdate)>'2021-08-01' and outtpt='${user_name}'ORDER by convert(date,OutLRDate) desc`)

      const count = await sql.query(`  select count( distinct OutLRNo ) as datacount
      from tbl_mdn m WITH(NOLOCK) left join tbl_transporter c with(nolock) on c.tid=m.outtpt where OutTransportBy='AWL' 
      AND isnull(ShipmentStatus,'')<>'Delivered'  AND ISNULL(OutLRNo,'')<>''   AND ISNULL(OutgpNo,'')<>''
      and convert(date,outlrdate)>'2021-08-01' and outtpt='${user_name}'`)
      res.status(200).send({
        'Result':result.recordsets[0],
        'Count':count.recordsets[0]
      })  

    } catch (err) {
      console.log(`ERROR OCCURRED ${err}`)
    }
  }
  async function LRInsert(req,res){
    const GPNo = req.body.GPNo;
    const LRNo = req.body.LRNo;
    const ShipmentStatus = req.body.ShipmentStatus;
    console.log(GPNo,LRNo,ShipmentStatus)
    try{
      await sql.connect(sqlConfig)
      const result = await sql.query(`insert into tbl_TrackShipment WITH(TABLOCK)([GPNo],[LRNO],[ShipmentStatus],[StatusDate],[StatusBy]) values ('${GPNo}','${LRNo}','${ShipmentStatus}',getdate(),'Aman')`);
      // console.log(result)
      // if(result){
      const data = await sql.query(`update tbl_MDN WITH(TABLOCK) set ShipmentStatus='${ShipmentStatus}',StatusDate=getdate() where OutLRNo ='${LRNo}'`);
      res.send('Updated')   
      // }
    }
    catch(err){
      console.log(err)
    }
  }

  async function LRDeliveredData(req,res){
    const user_name = req.body.user_name;
    console.log('Delivered',user_name)
    try {
      await sql.connect(sqlConfig)
      const result = await sql.query(`select distinct OutLRNo as LRNo,convert(varchar(15),OutLRDate,103) as OutLRDate,convert(date,outlrdate) as LrDate,OutGPNo as GatePass,c.Tname as Transporter,
      City,OutVehType as VehicleType,OutVehNo as VehicleNo,GPAllow,OutDriverNo,ShipmentStatus,DocketNo,convert(varchar(15),StatusDate,121) as StatusDate   
      from tbl_mdn m WITH(NOLOCK) left join tbl_transporter c with(nolock) on c.tid=m.outtpt where OutTransportBy='AWL' 
      AND isnull(ShipmentStatus,'')='Delivered'  AND ISNULL(OutLRNo,'')<>''   AND ISNULL(OutgpNo,'')<>''
      and convert(date,outlrdate)>'2021-08-01' and outlrno not in (select distinct tranId from gDrive_Data)  and  outtpt='${user_name}'ORDER by convert(date,OutLRDate) desc`)

      const count = await sql.query(` select count( DISTINCT OutLRNo) as datacount from tbl_mdn m
      WITH(NOLOCK) left join tbl_transporter c with(nolock) on c.tid=m.outtpt where OutTransportBy='AWL' AND isnull(ShipmentStatus,'')='Delivered'
       AND ISNULL(OutLRNo,'')<>''   AND ISNULL(OutgpNo,'')<>'' and convert(date,outlrdate)>'2021-08-01' and outlrno not in 
       (select distinct tranId from gDrive_Data) and outtpt='${user_name}'`)
      res.status(200).send({
        'Result':result.recordsets[0],
        'Count':count.recordsets[0]
      })  
    } catch (err) {
      console.log(`ERROR OCCURRED ${err}`)
    }
  }

//   select distinct OutLRNo as LRNo,OutLRDate as Date,OutGPNo as GatePass,c.Tname as Transporter,City,OutVehType as VehicleType,OutVehNo as VehicleNo,GPAllow,OutDriverNo,ShipmentStatus,DocketNo  from tbl_mdn m
// WITH(NOLOCK) left join tbl_transporter c with(nolock) on c.tid=m.outtpt where OutTransportBy='AWL' AND isnull(ShipmentStatus,'')='Delivered'
//  AND ISNULL(OutLRNo,'')<>''   AND ISNULL(OutgpNo,'')<>'' and convert(date,outlrdate)>'2021-08-01' and outlrno not in (select distinct tranId from gDrive_Data) and outtpt='v01861'

  async function LRDeliverUpdate(req,res){
    const GPNo = req.body.GPNo;
    const LRNo = req.body.LRNo;
    const ShipmentStatus = req.body.ShipmentStatus?req.body.ShipmentStatus:'Delivered';
    const StatusDate = req.body.StatusDate
    console.log('Update',GPNo,LRNo,ShipmentStatus,StatusDate)
    try{
      await sql.connect(sqlConfig)
      const data = await sql.query(`update tbl_MDN WITH(TABLOCK) set ShipmentStatus='${ShipmentStatus}',StatusDate='${StatusDate}' where OutLRNo ='${LRNo}'`)
      res.status(200).send('Updated')   
    }
    catch(err){
      console.log(err)
    }
  }

  async function LRUpload(req,res){
    const OutLRNo = req.body.OutLRNo;
    const UploadLink = req.body.UploadLink;
    console.log(OutLRNo,UploadLink)
    try{
      await sql.connect(sqlConfig)
      const Upload = await sql.query(`insert into gDrive_Data (tranid,file_url) values('${OutLRNo}','${UploadLink}')`)
      res.send('Upload')
    }
    catch(err){
      console.log(err)
    }
  }
  module.exports = {LRStatus,LRData,LRInsert,LRDeliveredData,LRDeliverUpdate,LRUpload}