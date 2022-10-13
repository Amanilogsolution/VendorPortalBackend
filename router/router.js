const express = require('express');
const router =  express.Router();

const VendorController = require('../controller/controller')
const FileUpload = require('../controller/FileUpload')
const Multer = require('../middleware/middleware')
const AddSupporting = require('../controller/SupportingController')
const InvoiceController = require('../controller/InvoiceController')
const fileMultiple =require('../controller/UploadMultiple')
const LrController = require('../controller/LrController')
const GuardMasterController = require('../controller/Guard/guardmaster')
const GuardsLogsController = require('../controller/Guard/GuardsLogs')


router.route('/vendordetails').post(VendorController.Vendordata)
router.route('/trans').get(VendorController.Vendorget)
router.route('/UpdateVendor').put(VendorController.UpdateVendor)
router.route('/InvoicesOffset').post(VendorController.InvoicesOffset)
router.route('/PendingInvoices').post(VendorController.PendingInvoices)

router.route('/InvoicesPractice').post(VendorController.InvoicePractice)
router.route('/SearchInvoice').post(VendorController.SearchInvoice)
router.route('/TotalInvoices').post(VendorController.TotalInvoices)
router.route('/InvoicesTotal').post(VendorController.InvoicesTotal)

router.post('/ViewSupporting',AddSupporting.getSupplorting)
router.post('/DeleteSupporting',AddSupporting.DeleteSupporting)

router.post('/FileUpload',Multer,FileUpload)

router.post('/FileUploadmultiple',Multer,fileMultiple)

router.post('/Supporting',Multer,AddSupporting.AddSupporting)

router.post('/UpdateDocument',AddSupporting.ReUploadDocument)
router.post('/AddInvoice',InvoiceController.AddInvoice)
router.post('/Getinvoices',InvoiceController.GetInvoices)
router.post('/DeleteInvoices',InvoiceController.DeleteInvoice)
router.post('/DeleteBlob',AddSupporting.deleteBlob)
router.post('/UpdateInvoicesData',InvoiceController.GetInvoicesUpdate)
router.post('/UpdateAddedInvoices',InvoiceController.UpdateInvoice)
router.post('/InsertLR',InvoiceController.GetLR)

router.post('/ShowSupportingdata',AddSupporting.ShowSupporting)
router.post('/UpdateInvoiceSupporting',AddSupporting.UpdateInvoiceSupporting)

router.post('/SupportingEdit',AddSupporting.SupportingEdit)
router.get('/LrStatus',LrController.LRStatus)
router.post('/LRData',LrController.LRData)
router.post('/LRInsert',LrController.LRInsert)
router.post('/LRDeliveredData',LrController.LRDeliveredData)
router.post('/LRDeliverUpdate',LrController.LRDeliverUpdate)
router.post('/LRUpload',LrController.LRUpload)

router.post('/insertguard',GuardMasterController.InsertGuard)
router.post('/totalguard',GuardMasterController.TotalGuards)
router.post('/deactiveguards',GuardMasterController.DeactiveGuards)
router.post('/activelocation',GuardMasterController.ActiveLocation)
router.post('/getguardmasterlogout',GuardMasterController.GetguardmasterLogout)
// router.post('/getguardmasterlogin',GuardMasterController.GetguardmasterLogin)


router.post('/insertGuardLogin',GuardsLogsController.InsertGuardLogin)
router.post('/getguardmasterlogin',GuardsLogsController.GetguardmasterLogin)
router.post('/updateguard',GuardsLogsController.UpdateGuard)



module.exports = router;
