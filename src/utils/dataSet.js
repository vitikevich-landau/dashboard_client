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

const rowNumber = cell => cell.replace(/\D+/g, '');

export const rowValue = row => row['v'];
export const rows = (workSheet, map = null) => {
  let rows = [], row, n;
  _.forEach(workSheet, (v, k) => {
    n = rowNumber(k);
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
export const workBookMap = workBook => {
  const sheetNames = usedSheetNames(workBook);
  const sheets = sheetNames.map(v => workBook.Sheets[v]);
  const map = sheets
    .map(r => rows(r, rowValue))
    .map((r, i) => r
      .map(
        s => [...s, sheetNames[i]]
      )
      .map(r => new Record(r[0], r[1], r[2], r[3], r[4], r[5]))
    );
  return _.zipObject(sheetNames, map);
};

export const records = workBookMap =>
  _.chain(workBookMap)
    .values()
    /*
    *   skip titles
    * */
    .map(r => r.slice(1))
    .flatten()
    .value();
