import mysql from 'promise-mysql';

export default class DB {
  public static async init() {
    DB._inst = new DB();
    await DB._inst.init();
  }

  public static get inst(): DB {
    return DB._inst!;
  }

  private static _inst: DB;
  private pool: mysql.Pool | undefined;
  private relseaseTimeoutMs: number = 3000;

  constructor() {}

  public async getConnection(): Promise<mysql.PoolConnection> {
    const conn = await this.pool!.getConnection();
    return conn;
  }

  protected async init() {
    this.pool = await mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_SCHEMA,
    });
  }
}