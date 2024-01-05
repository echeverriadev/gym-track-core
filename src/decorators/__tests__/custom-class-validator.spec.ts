import { validateOrReject } from 'class-validator';
import { IsArrayOfSize } from '../custom-class-validator';

class TestClass {
  @IsArrayOfSize(2)
  public testProperty: any[];
}

describe('CustomClassValidator', () => {
  describe('validator', () => {
    it('should validate successfully when the array length matches the constraint', async () => {
      const testClass = new TestClass();
      testClass.testProperty = ['value1', 'value2'];

      await expect(validateOrReject(testClass)).resolves.not.toThrow();
    });

    it('should fail validation when the array length does not match the constraint', async () => {
      const testClass = new TestClass();
      testClass.testProperty = ['value1', 'value2', 'value3'];

      const result = await validateOrReject(testClass).catch(() => false);

      expect(result).toBe(false);
    });
  });
});
