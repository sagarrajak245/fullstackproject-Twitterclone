import express from "express";
import { deleteNotifications, deleteOneNotifications, getNotifications } from "../controllers/notificationscontrollers.js";
import { protectRoute } from "../middleware/protectroute.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteOneNotifications);

export default router;