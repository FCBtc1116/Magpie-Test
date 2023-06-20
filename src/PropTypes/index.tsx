export interface IDataItemProps {
  cardName: string;
  gradingCompany: string;
  grade: string;
  txnDate: string;
  pricingSource: string;
  price: string;
}

export interface IConvertData {
  average: number;
  lowerBound: number;
  upperBound: number;
  standardDeviation: number;
  peakPrice: number;
  occurDay: string;
  name: string;
}
