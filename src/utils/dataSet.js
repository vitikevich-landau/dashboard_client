import XLSX from "xlsx";

export const fetchData = url =>
  fetch(url)
    .then(res => {
      if (!res.ok) { throw new Error("fetch failed");}
      return res.arrayBuffer();
    })
    .then(ab => XLSX.read(new Uint8Array(ab), {type: "array"}));


const getRowNumber = cell => cell.replace(/\D+/g, '');

/*const toHumanDate = date => {
  let dd = date.getDate(),
    mm = date.getMonth() + 1,
    yy = date.getFullYear() % 100;

  if (dd < 10) { dd = '0' + dd; }
  if (mm < 10) { mm = '0' + mm; }
  if (yy < 10) { yy = '0' + yy; }

  return `${dd}.${mm}.${yy}`;
};*/
/*const rowsToHumanDate = rows => {
  let left = rows.slice(0, 1),
    right = rows.slice(1);

  right = right.map(
    row => row.map(
      (v, i) => i === 2 ? parseDate(v) : v)
  );

  return [...left, ...right];
};*/

/*export const parseDate = value => {
  const date = XLSX.SSF.parse_date_code(value);
  return toHumanDate(new Date(date.y, date.m - 1, date.d));
};*/
export const getRowValue = row => row['v'];
export const getRows = (workSheet, cellMapper = null) => {
  let rows = [], row, n;

  for (const cell in workSheet) {
    n = getRowNumber(cell);

    if (!rows[n]) { rows[n] = []; }

    if (cellMapper) { row = cellMapper(workSheet[cell]); } else { row = workSheet[cell]; }

    rows[n].push(row);
  }

  return /*rowsToHumanDate*/(rows.filter(r => r));
};

// export const createRecordsArray = workSheet => {
//   return getRows(workSheet, getRowValue)
//     .slice(1)
//     .map(row => new Record(row[0], row[1], row[2], row[3], row[4]));
// };
