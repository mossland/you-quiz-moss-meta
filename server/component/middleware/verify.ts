import axios from 'axios';
import jwt from 'jsonwebtoken';

import UserModel from '../model/userModel';

export interface IKakaoUserInfo {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    }
  }
}

export interface IKakaoTokenInfo {
  id: number;
  expiresInMillis: number;
  app_id: number;
  appId: number;
  expires_in: number;
}


export const tokenVerify = async (accessToken: string) => {
  try {
    const {data: tokenInfo}: { data: IKakaoTokenInfo } = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return tokenInfo;
  } catch (e) {
    return null;
  }
}

export const adminVerify = async (usreId: string) => {
  const user = await UserModel.fetch(usreId);
  if (!user || !user.isAdmin) {
    return null;
  } else {
    return user;
  }
};

export const tokenVerifyMiddleware = async (req: any, res: any, next: any) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    res.status(401).send({
      message: 'Unauthorized',
    });
    return;
  }
  const tokenInfo = await tokenVerify(accessToken);
  if (!tokenInfo) {
    res.status(401).send({
      message: 'Unauthorized',
    });
    return;
  }

  res.locals.tokenInfo = tokenInfo;
  res.locals.accessToken = accessToken;
  next();
}

export const fetchUserInfoFromKakao = async (accessToken: string): Promise<IKakaoUserInfo> => {
  const { data: userInfo }: { data: IKakaoUserInfo } = await axios.post(
    'https://kapi.kakao.com/v2/user/me',
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      }
    }
  );
  return userInfo;
}

export const adminVerifyMiddleware = async (req: any, res: any, next: any) => {
  const tokenInfo = res.locals.tokenInfo;
  if (!tokenInfo) {
    res.status(401).send({
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const user = await adminVerify(tokenInfo.id.toString());
    if (!user) {
      res.status(401).send({
        message: 'Unauthorized',
      });
      return;
    }
    res.locals.user = user;
    next();
  } catch (e) {
    res.status(401).send({
      message: 'Unauthorized',
    });
    return;
  }
}

export const guestTokenVerify = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
}

export const guestTokenVerifyMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send({
      message: 'Unauthorized',
    });
    return;
  }
  const decoded = guestTokenVerify(token);
  if (!decoded) {
    res.status(401).send({
      message: 'Unauthorized',
    });
    return;
  }

  res.locals.tokenInfo = decoded;
  next();
}


export const verifyRecaptcha = async (token: string) => {
  const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
  );
  return data;
}

export const verifyRecaptchaMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers['x-recaptch-token'];
  if (!token) {
    res.status(401).send({
      message: 'Unauthorized',
    });
    return;
  }
  const data = await verifyRecaptcha(token);
  if (!data.success) {
    res.status(401).send({
      message: 'Unauthorized',
    });
    return;
  }
  if (data.score < 0.5) {
    res.status(401).send({
      message: 'Unauthorized - BOT DETECTED',
    });
    return;
  }
  next();
}