export class BodyMetricsCalculator {
  static calculateBMI(weight: number, height: number): number {
    return weight / (height * height);
  }

  static calculateBodyFatPercentage(
    gender: string,
    weight: number,
    waistCircumference: number,
    wristCircumference: number,
    hipCircumference: number,
    forearmCircumference: number,
  ): number {
    let bodyFatPercentage;

    if (gender === 'male') {
      bodyFatPercentage =
        495 /
          (1.0324 -
            0.19077 *
              Math.log10(
                waistCircumference - 0.15456 * Math.log10(wristCircumference),
              ) +
            0.15456 * Math.log10(weight)) -
        450;
    } else {
      bodyFatPercentage =
        495 /
          (1.29579 -
            0.35004 *
              Math.log10(
                waistCircumference + 0.221 * Math.log10(hipCircumference),
              ) -
            0.35004 * Math.log10(forearmCircumference)) -
        450;
    }

    return bodyFatPercentage;
  }

  static calculateLeanBodyMass(
    weight: number,
    bodyFatPercentage: number,
  ): number {
    return weight * (1 - bodyFatPercentage / 100);
  }
}
