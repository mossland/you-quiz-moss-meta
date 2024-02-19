import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';
import uuidv7 from '../util/uuidv7';
import chance from 'chance';

import UserModel from '../model/userModel';
import { fetchUserInfoFromKakao } from '../middleware/verify';

const router = express.Router();

router.post('/auth/kakao', async (req, res, next) => {
  try {
    const code = req.body.code;
    const qs = querystring.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: 'http://localhost:8080/callback',
      code,
    });
    const { data } = await axios.post(
      `https://kauth.kakao.com/oauth/token?${qs}`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        }
      }
    );
    
    const userInfo = await fetchUserInfoFromKakao(data.access_token);
    await UserModel.fetchOrCreate(userInfo.id.toString(), userInfo.properties.nickname)
    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
});

router.get('/login/guest', async (req, res, next) => {
  try {
    const guestId = uuidv7();
    const c = new chance();
    const guestName = `${c.first()} ${c.last()}}`;
    const token = jwt.sign({
      id: guestId,
      name: guestName,
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
    res.status(200).send({
      token,
      id: guestId,
      name: guestName,
    });
  } catch (e) {
    next(e);
  }
});

export default router;