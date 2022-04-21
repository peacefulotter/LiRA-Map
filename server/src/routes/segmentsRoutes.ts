import express from "express";
import databaseQuery from "../database";
const router = express.Router();

import SegmentsController from '../controllers/segments';

const segmentsController = new SegmentsController();

router.get('/:points', async (req: any, res: any) => {
    const points  = req.params.points;
    const type = req.query.type;
    const data = await databaseQuery( segmentsController.getSegments, 'visual', points, type)
    res.json(data)
});

router.get('/:id/energy', async (req: any, res: any) => {
    const segmentId  = req.params.id;

    const data = await databaseQuery( segmentsController.getEnergyDataFromSegment, 'visual', segmentId)
    res.json(data)
});

export default router;