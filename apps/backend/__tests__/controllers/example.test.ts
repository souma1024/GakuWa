import example from "../../src/controllers/example";

describe('add', (): void => {
  test('should return 3', (): void => {
    const result: number = example(1, 2);
    expect(result).toEqual(3);
  });
});