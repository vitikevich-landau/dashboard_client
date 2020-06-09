import XLSX from "xlsx";
import _ from 'lodash';

export const fetchData = url =>
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error("fetch failed");
      }
      return res.arrayBuffer();
    })
    .then(ab => XLSX.read(new Uint8Array(ab), {type: "array"}));

export const getNecessarySheetNames = workBook =>
  workBook.SheetNames.slice(0, workBook.SheetNames.length - 1);

const getRowNumber = cell => cell.replace(/\D+/g, '');

export const getRowValue = row => row['v'];
export const getRows = (workSheet, cellMapper = null) => {
  let rows = [], row, n;

  _.forEach(workSheet, (v, k) => {
    n = getRowNumber(k);
    if (!rows[n]) {
      rows[n] = [];
    }
    if (cellMapper) {
      row = cellMapper(workSheet[k]);
    } else {
      row = workSheet[k];
    }
    rows[n].push(row);
  });

  return _.compact(rows);
};