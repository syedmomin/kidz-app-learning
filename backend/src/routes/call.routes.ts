import { Router } from 'express';
import * as CallController from '../controllers/call.controller';

const router = Router();

router.post('/start', CallController.startCall);
router.post('/stream-user', CallController.streamUser);
router.get('/status/:callId', CallController.getStatus);
router.post('/stop', CallController.stop);
router.get('/twiml', CallController.getTwiML);
router.post('/twiml/status', CallController.callStatusCallback);

export default router;
