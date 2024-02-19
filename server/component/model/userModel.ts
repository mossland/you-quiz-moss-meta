import db from '../util/db';
import createError from 'http-errors';

export default class UserModel {
  public static async fetchOrCreate(userId: string, nickname: string) {
    const user = await UserModel.fetch(userId);

    if (!user) {
      const newUser = await UserModel.create(userId, nickname);
      return newUser;
    } else {
      return user;
    }

  }
  public static async fetch(userId: string): Promise<UserModel | undefined> {
    const conn = await db.inst.getConnection();
    try {
      const rawUsers = await conn.query(`SELECT * FROM \`user\` WHERE \`userId\` = ?`, [userId]);
      if (rawUsers.length === 0) {
        return undefined;
      } else {
        const rawUser = rawUsers[0];
        const user = new UserModel(rawUser.userId, rawUser.authority, rawUser.nickname);
        return user;
      }
    } catch (e) {
      throw createError(500, { view: 'DB user fetch Error', raw: e });
    } finally {
      await conn.release()
    }
  }

  public static async create(usreId: string, nickname: string): Promise<UserModel> {
    const conn = await db.inst.getConnection();
    try {
      await conn.query(`INSERT INTO \`user\` (\`userId\`, \`nickname\`) VALUES (?, ?)`, [usreId, nickname]);
      const user = new UserModel(usreId, 0, nickname);
      return user;
    } catch (e) {
      throw createError(500, { view: 'DB user create Error', raw: e });
    } finally {
      await conn.release();
    }
  }
  public nickname: string;
  private _userId: string;
  private _authority: number;

  constructor(userId: string, authority: number, nickname: string) {
    this.nickname = nickname;
    this._userId = userId;
    this._authority = authority;
  }
  public get userId(): string {
    return this._userId;
  }
  public get authority() : number {
    return this._authority;
  }
  public get isAdmin(): boolean {
    return this._authority > 0;
  }
}