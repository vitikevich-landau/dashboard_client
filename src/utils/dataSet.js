import XLSX from "xlsx";

export const fetchData = url =>
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error("fetch failed");
      }
      return res.arrayBuffer();
    })
    .then(ab => XLSX.read(new Uint8Array(ab), {type: "array"}));

export const getFilteredSheetNames = workBook =>
  workBook.SheetNames.slice(0, workBook.SheetNames.length - 1);

const getRowNumber = cell => cell.replace(/\D+/g, '');

export const getRowValue = row => row['v'];
export const getRows = (workSheet, cellMapper = null) => {
  let rows = [], row, n;

  for (const cell in workSheet) {
    n = getRowNumber(cell);

    if (!rows[n]) {
      rows[n] = [];
    }

    if (cellMapper) {
      row = cellMapper(workSheet[cell]);
    } else {
      row = workSheet[cell];
    }

    rows[n].push(row);
  }

  return /*rowsToHumanDate*/(rows.filter(r => r));
};