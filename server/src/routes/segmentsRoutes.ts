import express from "express";
const router = express.Router();

import SegmentsController from '../controllers/segmentsController';

const measurementsController = new SegmentsController();

router.get('/:points', measurementsController.getSegments);

export default router;