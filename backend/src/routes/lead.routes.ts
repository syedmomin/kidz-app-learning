import { Router } from "express";
import * as LeadController from "../controllers/lead.controller";

const router = Router();

router.get("/contacts", LeadController.getContacts);
router.post("/add", LeadController.addLead);
router.post("/start/:id", LeadController.startCall);
router.post("/schedule/:id", LeadController.scheduleCall);
router.delete("/:id", LeadController.deleteLead);

export default router;
