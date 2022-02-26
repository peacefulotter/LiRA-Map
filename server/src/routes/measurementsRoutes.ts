import express from "express";
const router = express.Router();

import MeasurementsController from '../controllers/measurementsController';

const measurementsController = new MeasurementsController();

router.get('/', measurementsController.getMeasurements);
router.get('/types', measurementsController.getMeasurementTypes);
router.get('/:taskid', measurementsController.getMeasurementsByTrip);

export default router;