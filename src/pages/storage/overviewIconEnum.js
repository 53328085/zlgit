import stackVoltage from './bmsMonitor/imgs/stackVoltage.png';
import stackCurrent from './bmsMonitor/imgs/stackCurrent.png';
import maxCellVoltage from './bmsMonitor/imgs/maxCellVoltage.png';
import minCellVoltage from './bmsMonitor/imgs/minCellVoltage.png';
import maxSystemTemp from './bmsMonitor/imgs/maxSystemTemp.png';
import minSystemTemp from './bmsMonitor/imgs/minSystemTemp.png';
import stackPower from './bmsMonitor/imgs/stackPower.png';

import voltageAb from './alternatorMonitor/imgs/voltageAb.png';
import voltageBc from './alternatorMonitor/imgs/voltageBc.png';
import voltageCa from './alternatorMonitor/imgs/voltageCa.png';
import currentA from './alternatorMonitor/imgs/currentA.png';
import currentB from './alternatorMonitor/imgs/currentB.png';
import currentC from './alternatorMonitor/imgs/currentC.png';
import activePower from './alternatorMonitor/imgs/activePower.png';
import reactivePower from './alternatorMonitor/imgs/reactivePower.png';
import apparentPower from './alternatorMonitor/imgs/apparentPower.png';
import powerFactor from './alternatorMonitor/imgs/powerFactor.png';

export const BMS_OVERVIEW_ICON_ENUM = {
  BatteryArrVoltage: stackVoltage,
  BatteryArrCurrent: stackCurrent,
  ArrBatteryVoltageMax: maxCellVoltage,
  ArrBatteryVoltageMin: minCellVoltage,
  SystemTemperature: maxSystemTemp,
  BatteryTemperatureMin: minSystemTemp,
  DischargePowerMax: stackPower,
  ChargePowerMax: stackPower,
};

export const PCS_OVERVIEW_ICON_ENUM = {
  LineVoltageAB: voltageAb,
  LineVoltageBC: voltageBc,
  LineVoltageCA: voltageCa,
  PhaseCurrentA: currentA,
  PhaseCurrentB: currentB,
  PhaseCurrentC: currentC,
  ActivePower: activePower,
  ReactivePower: reactivePower,
  ApparentPower: apparentPower,
  PowerFactor: powerFactor,
};

export function getOverviewIcon(iconEnum, iconKey) {
  return iconEnum?.[iconKey] || '';
}
