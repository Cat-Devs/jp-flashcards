import fs from 'fs';
import { LocalDb } from './local-db';

jest.mock('fs');

describe('LocalDatabase', () => {
  describe('Create', () => {
    it('should create db', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
      LocalDb.create();

      expect(fs.copyFileSync).toBeCalled();
    });

    it('should not create db', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
      LocalDb.create();

      expect(fs.copyFileSync).not.toBeCalled();
    });
  });

  describe('Get', () => {
    it('should get an item', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[{ "id": "123" }, { "id": "345" }]');

      expect(LocalDb.get({ Key: { id: '123' } })).toStrictEqual({ id: '123' });
    });

    it('should not get an item', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[{ "id": "123" }, { "id": "345" }]');

      expect(LocalDb.get({ Key: { id: '000' } })).toStrictEqual(undefined);
    });

    it('should throw', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('much cat');

      expect(() => {
        LocalDb.query();
      }).toThrowError();
    });
  });

  describe('Put', () => {
    it('should update item', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[{ "id": "123" }, { "id": "345" }]');
      jest.spyOn(fs, 'writeFileSync');

      const item = LocalDb.put({ Item: { id: '123' } });

      expect(fs.writeFileSync).toBeCalled();
      expect(item).toEqual({ id: '123' });
    });

    it('should add item', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[]');
      jest.spyOn(fs, 'writeFileSync');

      const item = LocalDb.put({ Item: { id: '123' } });

      expect(fs.writeFileSync).toBeCalled();
      expect(item).toEqual({ id: '123' });
    });

    it('should throw', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('much cat');

      expect(() => {
        LocalDb.query();
      }).toThrowError();
    });
  });

  describe('Update', () => {
    it('should update level', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[{"id": "123","current_level": "1"}]');
      jest.spyOn(fs, 'writeFileSync');

      const item = LocalDb.update({ Key: { id: '123' } });

      expect(fs.writeFileSync).toBeCalled();
      expect(item).toEqual({
        id: '123',
        current_level: '2',
      });
    });

    it('should throw', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[{"id": "123","current_level": "1"}]');
      expect(() => LocalDb.update({ Key: { id: '000' } })).toThrow();
    });

    it('should throw when readDb fails', () => {
      jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => {
        LocalDb.update({ Key: { id: '123' } });
      }).toThrow();
    });

    it('should throw when updateDb fails', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[{"id": "123","current_level": "1"}]');
      jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => {
        LocalDb.update({ Key: { id: '123' } });
      }).toThrow();
    });
  });

  describe('Query', () => {
    it('should succeed', () => {
      const data = [{ id: '123' }];

      const spyReadSpySync = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[{ "id": "123" }]');

      const db = LocalDb.query();

      expect(spyReadSpySync).toBeCalled();
      expect(db).toEqual(data);
    });

    it('should throw', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('much cat');

      expect(() => {
        LocalDb.query();
      }).toThrowError();
    });
  });
});
