import express from 'express';
import { adminVerifyMiddleware, tokenVerifyMiddleware } from '../middleware/verify';
import PersonQuizModel from '../model/personQuizModel';

const router = express.Router();

router.use(tokenVerifyMiddleware);
router.use(adminVerifyMiddleware);

router.get('/person/all', async (req, res, next) => {
  try {
    const data = await PersonQuizModel.adminFetchAll()
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
});

router.post('/person/add-answer', async (req, res, next) => {
  try {
    const { personId, answer } = req.body;
    const success = await PersonQuizModel.adminAddAnswer(personId, answer);
    res.status(200).send(success);
  } catch (e) {
    next(e);
  }
});

router.delete('/person/remove-answer/:personId/:answer', async (req, res, next) => {
  try {
    const { personId, answer } = req.params;
    const success = await PersonQuizModel.adminRemoveAnswer(personId, answer);
    res.status(200).send(success);
  } catch (e) {
    next(e);
  }
});

export default router;