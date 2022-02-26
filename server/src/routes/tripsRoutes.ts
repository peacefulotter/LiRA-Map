import express from "express";
const router = express.Router();

import TripsController from '../controllers/tripsController';

const tripsController = new TripsController();

router.get('/', tripsController.getAllTrips);
router.get('/:taskid', tripsController.getTripByTaskId);

export default router;