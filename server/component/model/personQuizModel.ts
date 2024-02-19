import db from '../util/db';
import createError from 'http-errors';
import chance from 'chance';

export interface ICategory {
  category: string;
  isAvailable: boolean;
}

export interface IQuiz {
  personId: string;
  picId: string;
  category: string;
}

export interface IAnswer {
  personId: string;
  ans: string[];
}

export interface IPersonAdminRawData {
  personId: string;
  name: string;
  group: string;
  gender: boolean;
  personIsAvailable: boolean;
  picId: string;
  picIsAvailable: boolean;
  category: string;
  ansId: number;
  answer: string;
}

export interface IPersonAdminData {
  personId: string;
  name: string;
  group: string;
  gender: boolean;
  personIsAvailable: boolean;
  picId: string;
  picIsAvailable: boolean;
  category: string;
  answer: string[];
}


export default class PersonQuizModel {
  public static async fetchCategoryList(): Promise<ICategory[]> {
    const conn = await db.inst.getConnection();

    let categories;
    try {
      categories = await conn.query(
        `SELECT * FROM \`person_category_all\``,
      );
      return categories;
    } catch (e) {
      throw createError(500, { view: 'DB Error', raw: e });
    } finally {
      await conn.release();
    }
  }

  public static async fetchQuizFromCategoryExclude(category: string[], exclude: string[], quizCount: number): Promise<IQuiz[]> {
    const conn = await db.inst.getConnection();

    let result: IQuiz[] = [];
    try {
      let quizList = await conn.query(
        `SELECT 
          p.personId AS personId,
          pic.picId AS picId,
          pc.category AS category
        FROM \`person\` p
          INNER JOIN person_category pc ON pc.personId = p.personId
          INNER JOIN person_category_all pca ON pc.category = pca.category AND pca.isAvailable = 1
          INNER JOIN person_pic pic ON pic.personId = p.personId AND pic.isAvailable = 1
        WHERE p.personId NOT IN ( ? ) AND pc.category IN ( ? ) AND p.isAvailable = 1`,
        [
          [ '', ...exclude ],
          category
        ],
      );

      if (quizList.length === 0) {
        return [];
      }
      const c = new chance();
      Array.from({ length: quizCount }, () => {
        const idx = c.integer({ min: 0, max: quizList.length - 1});
        // const idx = 0;
        result.push(quizList[idx]);
        quizList = [
          ...quizList.slice(0, idx),
          ...quizList.slice(idx + 1, quizList.length),
        ];
      });
      return result;
    } catch (e) {
      throw createError(500, { view: 'DB Error', raw: e });
    } finally {
      await conn.release();
    }
  }

  public static async fetchAnswer(personId: string): Promise<IAnswer> {
    const conn = await db.inst.getConnection();
    try {
      const result: Array<{ personId: string, ans: string }> = await conn.query(
        `SELECT 
          personId,
          ans
        FROM \`person_ans\`
        WHERE personId = ? AND isAvailable = 1`,
        [
          personId,
        ],
      );
      return result.reduce((acc: IAnswer, cur) => {
        acc.ans.push(cur.ans);
        return acc;
      }, { personId, ans: [] });
    } catch (e) {
      throw createError(500, { view: 'DB ans fetch Error', raw: e });
    } finally {
      await conn.release();
    }
  }

  public static async adminFetchAll(): Promise<IPersonAdminData[]> {
    const conn = await db.inst.getConnection();
    try {
      const rawData: IPersonAdminRawData[] = await conn.query(
        `SELECT
            p.personId AS personId,
            p.\`name\` AS \`name\`,
            p.\`group\` AS \`group\`,
            p.gender AS gender,
            p.isAvailable AS personIsAvailable,
            pi.picId AS picId,
            pi.isAvailable AS picIsAvailable,
            pc.\`category\` AS \`category\`,
            pa.\`ansId\` AS \`ansId\`,
            pa.\`ans\` AS \`answer\`
          FROM \`person\` p
            INNER JOIN person_pic pi ON pi.personId = p.personId
            INNER JOIN person_category pc ON pc.personId = p.personId
            INNER JOIN person_ans pa ON pa.personId = p.personId AND pa.isAvailable = 1`
      );
      const groupByAnswer = rawData.reduce((acc: {[personId: string]: IPersonAdminData}, cur: IPersonAdminRawData) => {
        if (!acc[`${cur.category}_${cur.personId}`]) {
          acc[`${cur.category}_${cur.personId}`] = {
            personId: cur.personId,
            name: cur.name,
            group: cur.group,
            gender: cur.gender,
            personIsAvailable: cur.personIsAvailable,
            picId: cur.picId,
            picIsAvailable: cur.picIsAvailable,
            category: cur.category,
            answer: [{
              ansId: cur.ansId,
              ans: cur.answer
            }],
          } as any;
          return acc;
        } else {
          if (acc[`${cur.category}_${cur.personId}`].answer.findIndex((an) => { return (an as any).ansId === cur.ansId }) >= 0) {
            return acc;
          } else {
            acc[`${cur.category}_${cur.personId}`].answer.push({
              ansId: cur.ansId,
              ans: cur.answer
            } as any);
            return acc;
          }
        }
      }, {});

      return Object.values(groupByAnswer).map((v) => {
        v.answer = v.answer.map((a: any) => { return a.ans });
        return v;
      });
    } catch (e) {
      throw createError(500, { view: 'DB admin fetch person data Error', raw: e });
    } finally {
      await conn.release();
    }
  }

  public static async adminAddAnswer(personId: string, answer: string) {
    const conn = await db.inst.getConnection();
    
    try {
      await conn.query(
        `INSERT INTO \`person_ans\` ( personId, ans, isAvailable )
        VALUES ( ?, ?, ? )`, [ personId, answer, 1 ],
      );
      return true;
    } catch (e) {
      throw createError(500, { view: 'DB admin add answer Error', raw: e });
    } finally {
      await conn.release();
    }
  }

  public static async adminRemoveAnswer(personId: string, answer: string) {
    const conn = await db.inst.getConnection();
    try {
      await conn.query(
        `DELETE FROM \`person_ans\` WHERE personId = ? AND ans = ?`,
        [ personId, answer ]
      );
      return true;
    } catch (e) {
      throw createError(500, { view: 'DB admin remove answer Error', raw: e });
    } finally {
      await conn.release();
    }
  }
}