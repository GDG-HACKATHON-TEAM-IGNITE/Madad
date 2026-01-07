import express from 'express'
const router = express.Router()
import { registerPoliceDevice, verifyPoliceDevice, checkDeviceVerification } from '../controllers/station.js'
router.post("/policeDeviceReg", registerPoliceDevice)
router.post("/verifyDevice", verifyPoliceDevice)
router.post("/checkDevice", checkDeviceVerification)
export default router;
