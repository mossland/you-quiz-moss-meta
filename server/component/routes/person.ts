import express from 'express';
import PersonQuizModel from '../model/personQuizModel';
import { guestTokenVerifyMiddleware, verifyRecaptchaMiddleware } from '../middleware/verify';
import { regularize } from '../util/stringUtil';
import RateLimit from 'express-rate-limit';

const router = express.Router();

router.get('/category', async (req, res, next) => {
  try {
    const list = await PersonQuizModel.fetchCategoryList();
    return res.status(200).send(list);
  } catch (e) {
    next(e);
  }
});

const limiter = RateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: parseInt(process.env.LIMIT || '0', 10),
});

router.get('/quiz',
  process.env.LIMIT ? limiter : (req, res, next) => {next();},
  guestTokenVerifyMiddleware,
  verifyRecaptchaMiddleware,
  async (req, res, next) => {
    try {
      let solvedPidList: string[] = [];
      if (req.query.solved) {
        solvedPidList = Object.values(req.query.solved as any) as string[];
      }
      const categoryList: string[] = req.query.category as string[];
      const quiz = await PersonQuizModel.fetchQuizFromCategoryExclude(categoryList, solvedPidList, 1);
      if (quiz.length === 0) {
        return res.status(200).send({ end: true });
      } else {
        return res.status(200).send(quiz[0]);  
      }
    } catch (e) {
      next(e);
    }
  }
);

router.post('/answer/:pid', guestTokenVerifyMiddleware, async (req, res, next) => {
  try {
    let submitAnswer: string = regularize(req.body.answer);
    const ans = await PersonQuizModel.fetchAnswer(req.params.pid);
    let ansIdx: number = -1;
    const correct = ans.ans.reduce((acc, cur, idx) => {
      const reg = regularize(cur);
      if (reg === submitAnswer) {
        ansIdx = idx;
      }
      return acc || reg === submitAnswer;
    }, false);
    res.status(200).send({
      personId: req.params.pid,
      answer: correct ? ans.ans[ansIdx] : ans.ans[0],
      subanswer: correct ? ans.ans.slice(0, ansIdx).concat(ans.ans.slice(ansIdx + 1, ans.ans.length)) : ans.ans.slice(1, ans.ans.length),
      correct,
    });
  } catch (e) {
    next(e);
  }
});


export default router;