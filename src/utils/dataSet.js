import XLSX from "xlsx";
import _ from 'lodash';
import { MONTHS } from "@/configs";

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

export const toRecords = workBook => {
  const sheetNames = usedSheetNames(workBook);
  const sheets = sheetNames.map(v => workBook.Sheets[v]);
  return sheets
    .map(r => getRows(r, getRowValue))
    .map((r, i) =>
      r.map(s => [...s, sheetNames[i]])
        .slice(1)
    )
    .reduce((acc, r) => [...acc, ...r], []);
};

export const toRound = n => _.round(n, 2);

export const mergeWithMonths = records =>
  _.merge(
    _.zipObject((_.keys(MONTHS))), records
  );