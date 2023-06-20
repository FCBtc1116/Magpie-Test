import React, { useCallback, useEffect, useState } from "react";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { IDataItemProps, IConvertData } from "./PropTypes";
import Card from "./Components/Card";
import "./App.css";

type GroupedData = Record<string, IDataItemProps[]>;

function App() {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtenstion = ".xlsx";
  const [groupData, setGroupData] = useState<GroupedData>({}); // Source Data
  const [convertData, setConvertData] = useState<IConvertData[]>([]); // Convert Data

  // Convert data match with Card types
  const convertGroupData = (sourceData: GroupedData) => {
    const resultConvertData = Object.keys(sourceData).map((key) => {
      const prices = sourceData[key].map((item) =>
        Number(item.price.replaceAll("$", "").replaceAll(",", ""))
      );
      const sum = prices.reduce((acc, curr) => acc + curr, 0);
      const avg = sum / sourceData[key].length;
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const stdDev: number = Math.sqrt(
        prices.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b) /
          sourceData[key].length
      );

      const peakValue = sourceData[key].reduce((prev, curr) => {
        return Number(curr.price.replaceAll("$", "").replaceAll(",", "")) >
          Number(curr.price.replaceAll("$", "").replaceAll(",", ""))
          ? curr
          : prev;
      });
      const result = {
        average: Number((Math.round(avg * 100) / 100).toFixed(2)),
        lowerBound: Number((Math.round(min * 100) / 100).toFixed(2)),
        upperBound: Number((Math.round(max * 100) / 100).toFixed(2)),
        standardDeviation: Number((Math.round(stdDev * 100) / 100).toFixed(2)),
        peakPrice: Number(
          (
            Math.round(
              Number(peakValue.price.replaceAll("$", "").replaceAll(",", "")) *
                100
            ) / 100
          ).toFixed(2)
        ),
        occurDay: peakValue.txnDate,
        name: key,
      };
      return result;
    });
    setConvertData(resultConvertData);
  };

  const exportJson = useCallback(
    (name: string) => {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(groupData[name])
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = `${name}.json`;

      link.click();
    },
    [groupData]
  );
  const exportXLSX = useCallback(
    (name: string) => {
      const ws = XLSX.utils.json_to_sheet(groupData[name]);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, name + fileExtenstion);
    },
    [groupData]
  );
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://mocki.io/v1/70f45519-0232-463b-bd4f-88e9d7213d26"
      );
      const jsonData = await response.json();

      // Separate the Json Value into groups depend on cardName Field.

      const groupedCard = jsonData.reduce(
        (result: GroupedData, card: IDataItemProps) => {
          if (!result[card.cardName]) result[card.cardName] = [];
          result[card.cardName].push(card);
          return result;
        },
        {}
      );
      setGroupData(groupedCard);
      // Call Convert Data
      convertGroupData(groupedCard);
    };
    fetchData();
  }, []);
  return (
    <div className="container mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
        {convertData.map((item: IConvertData) => {
          return (
            <Card
              key={item.name}
              name={item.name}
              average={item.average}
              lowerBound={item.lowerBound}
              upperBound={item.upperBound}
              standardDeviation={item.standardDeviation}
              peakPrice={item.peakPrice}
              occurDay={item.occurDay}
              data={groupData[item.name]}
              onExportJson={exportJson}
              onExportXLSX={exportXLSX}
            ></Card>
          );
        })}
      </div>
    </div>
  );
}

export default App;
