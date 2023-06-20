import { CSVLink } from "react-csv";
import { IDataItemProps } from "../PropTypes";

const Card = (props: ICardProps) => {
  const headers = [
    { label: "Card Name", key: "cardName" },
    { label: "Grading Company", key: "gradingCompany" },
    { label: "Grade", key: "grade" },
    { label: "Txn Date", key: "txnDate" },
    { label: "Pricing Source", key: "pricingSource" },
    { label: "Price", key: "price" },
  ];

  const csvReport = {
    data: props.data,
    headers: headers,
    filename: `${props.name}.csv`,
  };

  return (
    <div className="bg-gray-300 rounded-lg p-3">
      <div className="flex flex-col justify-between">
        <p className="text-xl text-center">{props.name}</p>
        <div className="flex justify-between">
          <p>Average: ${props.average}</p>
          <p>LowerBound: ${props.lowerBound}</p>
          <p>UpperBound: ${props.upperBound}</p>
        </div>
        <div className="flex justify-between">
          <p>StandardDeviation: {props.standardDeviation}</p>
          <p>PeakPrice: {props.peakPrice}</p>
          <p>OccurDay: {props.occurDay}</p>
        </div>
        <div className="flex justify-between">
          <button
            className="block w-full text-md text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            onClick={() => props.onExportJson(props.name)}
          >
            Export To JSON
          </button>
          <CSVLink
            className="block w-full text-md text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            {...csvReport}
          >
            Export To CSV
          </CSVLink>
          <button
            className="block w-full text-md text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            onClick={() => props.onExportXLSX(props.name)}
          >
            Export To XLSX
          </button>
        </div>
      </div>
    </div>
  );
};

declare interface ICardProps {
  average: number;
  lowerBound: number;
  upperBound: number;
  standardDeviation: number;
  peakPrice: number;
  occurDay: string;
  name: string;
  data: IDataItemProps[];
  onExportJson: (name: string) => void;
  onExportXLSX: (name: string) => void;
}

export default Card;
