import XLSX from "xlsx";
import _ from 'lodash';
import { Record } from "@/models/Record";

export const fetchData = url =>
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error("fetch failed");
      }
      return res.arrayBuffer();
    })
    .then(ab => XLSX.read(new Uint8Array(ab), {type: "array"}));

export const usedSheetNames = workBook =>
  workBook.SheetNames.slice(0, workBook.SheetNames.length - 1);

const getRowNumber = cell => cell.replace(/\D+/g, '');

export const getRowValue = row => row['v'];
export const getRows = (workSheet, map = null) => {
  let rows = [], row, n;
  _.forEach(workSheet, (v, k) => {
    n = getRowNumber(k);
    if (!rows[n]) {
      rows[n] = [];
    }
    if (map) {
      row = map(workSheet[k]);
    } else {
      row = workSheet[k];
    }
    rows[n].push(row);
  });
  return _.compact(rows);
};
export const toWorkBookMap = workBook => {
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
};

export const toRecords = workBookMap =>
  _.chain(workBookMap)
    .values()
    /*
    *   skip titles
    * */
    .map(r => r.slice(1))
    .map(r =>
      r.map(v => new Record(v[0], v[1], v[2], v[3], v[4], v[5]))
    )
    .flatten()
    .value();

export const getRecordProps = (records, name) =>
  _(records)
    .map(r => r[name])
    .uniq()
    .value();

export const getYears = records => getRecordProps(records, 'year');
export const getDistricts = records => getRecordProps(records, 'district');
export const getInstitutions = records => getRecordProps(records, 'institution');

export const toRound = n => _.round(n, 2);