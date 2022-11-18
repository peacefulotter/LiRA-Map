import { MeasurementEntity } from './EnergyInterfaces';

// https://en.wikipedia.org/wiki/Linear_interpolation#Linear_interpolation_between_two_known_points
export function linearInterpolate(
  x: number,
  [x0, y0]: [number, number],
  [x1, y1]: [number, number],
): number {
  // assert x0 <= x1
  return (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0);
}

export function calcWhlTrq(
  whlTrqBefore: MeasurementEntity,
  whlTrqAfter: MeasurementEntity,
  curPower: MeasurementEntity,
) {
  const dateBefore = whlTrqBefore.Created_Date.getTime();
  const whlTrqBeforeVal = this.getMeasVal(whlTrqBefore);

  const dateAfter = whlTrqBefore.Created_Date.getTime();
  const whlTrqAfterVal = this.getMeasVal(whlTrqAfter);

  return (
    linearInterpolate(
      curPower.Created_Date.getTime(),
      [dateBefore, whlTrqBeforeVal],
      [dateAfter, whlTrqAfterVal],
    ) - 51300
  );
}

export function calcSpd(
  spdBefore: MeasurementEntity,
  spdAfter: MeasurementEntity,
  curPower: MeasurementEntity,
) {
  const dateBefore = spdBefore.Created_Date.getTime();
  const spdBeforeMPS = this.getMeasVal(spdBefore) / 3.6;

  const dateAfter = spdAfter.Created_Date.getTime();
  const spdAfterMPS = this.getMeasVal(spdAfter) / 3.6;

  return linearInterpolate(
    curPower.Created_Date.getTime(),
    [dateBefore, spdBeforeMPS],
    [dateAfter, spdAfterMPS],
  );
}

export function calcAcc(
  accBefore: MeasurementEntity,
  accAfter: MeasurementEntity,
  curPower: MeasurementEntity,
) {
  const dateBefore = accBefore.Created_Date.getTime();
  const accBeforeVal = (this.getMeasVal(accBefore) - 2 * 198) * 0.05;

  const dateAfter = accAfter.Created_Date.getTime();
  const accAfterVal = (this.getMeasVal(accBefore) - 2 * 198) * 0.05;

  return linearInterpolate(
    curPower.Created_Date.getTime(),
    [dateBefore, accBeforeVal],
    [dateAfter, accAfterVal],
  );
}

export function calcPower(curPower: MeasurementEntity) {
  return (this.getMeasVal(curPower) - 160) * 1000;
}
