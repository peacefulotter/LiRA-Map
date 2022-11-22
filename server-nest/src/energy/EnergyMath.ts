import { MeasEnt } from './EnergyInterfaces';

// https://en.wikipedia.org/wiki/Linear_interpolation#Linear_interpolation_between_two_known_points
export function linInterp(
  x: number,
  [x0, y0]: [number, number],
  [x1, y1]: [number, number],
): number {
  // assert x0 <= x1
  return (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0);
}

function getMeasVal(meas: MeasEnt): number {
  const valueTag: string = meas.T + '.value';
  const message: JSON = meas.message;

  if (message.hasOwnProperty(valueTag)) {
    return message[valueTag];
  }
}

export function interpMeas(time: Date, meas1: MeasEnt, meas2: MeasEnt) {
  const x1 = meas1.Created_Date.getTime();
  const y1 = getMeasVal(meas1);

  const x2 = meas2.Created_Date.getTime();
  const y2 = getMeasVal(meas2);

  return linInterp(time.getTime(), [x1, y1], [x2, y2]);
}

export function calcWhlTrq(
  whlTrqBefore: MeasEnt,
  whlTrqAfter: MeasEnt,
  curPower: MeasEnt,
) {
  const dateBefore = whlTrqBefore.Created_Date.getTime();
  const whlTrqBeforeVal = this.getMeasVal(whlTrqBefore);

  const dateAfter = whlTrqBefore.Created_Date.getTime();
  const whlTrqAfterVal = this.getMeasVal(whlTrqAfter);

  return (
    linInterp(
      curPower.Created_Date.getTime(),
      [dateBefore, whlTrqBeforeVal],
      [dateAfter, whlTrqAfterVal],
    ) - 51300
  );
}

export function calcSpd(
  spdBefore: MeasEnt,
  spdAfter: MeasEnt,
  curPower: MeasEnt,
) {
  const dateBefore = spdBefore.Created_Date.getTime();
  const spdBeforeMPS = this.getMeasVal(spdBefore) / 3.6;

  const dateAfter = spdAfter.Created_Date.getTime();
  const spdAfterMPS = this.getMeasVal(spdAfter) / 3.6;

  return linInterp(
    curPower.Created_Date.getTime(),
    [dateBefore, spdBeforeMPS],
    [dateAfter, spdAfterMPS],
  );
}

export function calcAcc(
  accBefore: MeasEnt,
  accAfter: MeasEnt,
  curPower: MeasEnt,
) {
  const dateBefore = accBefore.Created_Date.getTime();
  const accBeforeVal = (this.getMeasVal(accBefore) - 2 * 198) * 0.05;

  const dateAfter = accAfter.Created_Date.getTime();
  const accAfterVal = (this.getMeasVal(accBefore) - 2 * 198) * 0.05;

  return linInterp(
    curPower.Created_Date.getTime(),
    [dateBefore, accBeforeVal],
    [dateAfter, accAfterVal],
  );
}

export function calcPower(curPower: MeasEnt) {
  return (this.getMeasVal(curPower) - 160) * 1000;
}
