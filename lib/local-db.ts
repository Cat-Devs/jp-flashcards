import { DynamoDB } from 'aws-sdk';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import dbTemplate from '../data/db-template.json';

type LocalDatabase = typeof dbTemplate;
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export class LocalDb {
  private static readonly pathToLocalDb = join(process.cwd(), 'data', 'localDb.json');
  private static readonly pathToLocalDbTemplate = join(process.cwd(), 'data', 'table-data-local.json');

  private static readDb(): LocalDatabase {
    const file = readFileSync(this.pathToLocalDb, { encoding: 'utf-8' });

    try {
      return JSON.parse(file);
    } catch (e) {
      throw new Error('Local database is not a valid JSON');
    }
  }

  private static updateDb(data: LocalDatabase) {
    const file = JSON.stringify(data);
    return writeFileSync(this.pathToLocalDb, file, { encoding: 'utf-8' });
  }

  static create(): void {
    if (!existsSync(this.pathToLocalDb)) {
      copyFileSync(this.pathToLocalDbTemplate, this.pathToLocalDb);
    }
  }

  static query(): LocalDatabase {
    return this.readDb();
  }

  static get(params: Omit<DynamoDB.DocumentClient.GetItemInput, 'TableName'>): ArrayElement<LocalDatabase> | undefined {
    return this.readDb().find((item) => item.id === params.Key.id);
  }

  static put(params: Omit<DynamoDB.DocumentClient.PutItemInput, 'TableName'>): DynamoDB.DocumentClient.PutItemOutput {
    const db = this.readDb();

    const itemIndex = db.findIndex((item) => item.id === params.Item.id);

    if (itemIndex === -1) {
      db.push(params.Item as ArrayElement<LocalDatabase>);
    } else {
      db[itemIndex] = params.Item as ArrayElement<LocalDatabase>;
    }

    this.updateDb(db);

    return params.Item;
  }

  static update(
    params: Omit<DynamoDB.DocumentClient.UpdateItemInput, 'TableName'>
  ): DynamoDB.DocumentClient.UpdateItemOutput {
    const db = this.readDb();

    const itemIndex = db.findIndex((item) => item.id === params.Key.id);

    if (itemIndex === -1) {
      throw new Error('Item does not exist in local db');
    }

    db[itemIndex].current_level = (parseInt(db[itemIndex].current_level, 10) + 1).toString();
    this.updateDb(db);
    return db[itemIndex] as DynamoDB.DocumentClient.UpdateItemOutput;
  }
}
