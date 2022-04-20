import express from "express";
import databaseQuery from "../database";
const router = express.Router();

import SegmentsController from '../controllers/segments';

const measurementsController = new SegmentsController();

router.get('/:points', async (req: any, res: any) => {
    const { points } = req.params;
    const { type } = req.query;
    const data = await databaseQuery( measurementsController.getSegments, 'visual', [points, type] )
    res.json(data)
});

export default router;