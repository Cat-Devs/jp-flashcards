import { pickRandomCards } from './pick-random-card';

describe('pickRandomCards', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
  });

  it('should return one random card', () => {
    const input = ['1', '2', '3'];
    const expectedOutput = [input[0]];
    const res = pickRandomCards(input);

    expect(res.length).toBe(1);
    expect(res).toEqual(expectedOutput);
  });

  it('should return two random card', () => {
    const input = ['1', '2', '3'];
    const expectedOutput = [input[0], input[1]];

    const res = pickRandomCards(input, 2);

    expect(res.length).toBe(2);
    expect(res).toEqual(expectedOutput);
  });

  it('should return three random card', () => {
    const input = ['1', '2', '3'];

    const res = pickRandomCards(input, 3);

    expect(res.length).toBe(3);
    expect(res).toEqual(input);
  });

  it('should not exceed the maximum size of the given input', () => {
    const input = ['1', '2', '3'];

    const res = pickRandomCards(input, input.length + 2);

    expect(res.length).toBe(input.length);
    expect(input.sort()).toEqual(res.sort());
  });

  it('should return an empty array when proving an empty input', () => {
    const input = [];

    const res = pickRandomCards(input, 2);

    expect(res.length).toBe(input.length);
    expect(input.sort()).toEqual(res.sort());
  });

  it('should not alter the provided input', () => {
    const input = ['1', '2', '3'];
    const inputLength = input.length;

    pickRandomCards(input, 2);

    expect(input.length).toBe(inputLength);
  });
});
