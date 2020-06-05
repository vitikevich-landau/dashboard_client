import XLSX from "xlsx";
import { DATA_URL } from "@/configs";

export const fetchXLSXDataMixin = {
  methods: {
    fetchData() {
      fetch(DATA_URL)
        .then(res => {
          /* get the data as a Blob */
          if (!res.ok) {
            throw new Error("fetch failed");
          }
          return res.arrayBuffer();
        })
        .then(ab => {
          /* parse the data when it is received */
          const data = new Uint8Array(ab);
          const workbook = XLSX.read(data, {type: "array"});

          /* DO SOMETHING WITH workbook HERE */

          console.log(data);
          console.log(workbook);

        });
    }
  }
};