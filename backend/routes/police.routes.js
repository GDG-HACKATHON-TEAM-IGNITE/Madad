import express from 'express'
const router=express.Router()
 import { registerPoliceDevice,verifyPoliceDevice, } from '../controllers/station.js'
router.post("/policeDeviceReg",registerPoliceDevice)
router.post("/verifyDevice",verifyPoliceDevice)
export default router;
