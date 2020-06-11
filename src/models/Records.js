import {getRows, getRowValue, usedSheetNames} from "@/utils/dataSet";
// import { Record } from "@/models/Record";
// import { MONTHS } from "@/configs";
import _ from 'lodash';

export class Records {
  constructor(workBook) {
    this.records = this._toWorkBookMap(workBook);
  }

  _toWorkBookMap(workBook) {
    const sheetNames = usedSheetNames(workBook);
    const sheets = sheetNames.map(v => workBook.Sheets[v]);
    const map = sheets
      .map(r => getRows(r, getRowValue))
      .map((r, i) => r
        .map(
          s => [...s, sheetNames[i]]
        )
      );
    return _.zipObject(sheetNames, map);
  }

  count() {
    return _.values(this.records).length;
  }
}