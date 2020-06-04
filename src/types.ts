// export type Joined = ContractOverview &
//   Partial<Contract> &
//   Partial<Order> &
//   Partial<Product>;
export interface ContractOverview {
  customerName: string;
  customerRpi: string;
  companyCodeName: string;
  companyCodeNumber: string;
  contracts: Contract[];
  thirdPartyNumbers: ThirdPartyNumber[];
}

export interface Contract {
  contractRpi: number;
  salesResponsible: string;
  contractTypeCode: string;
  totalRevenue: string;
  totalCost: string;
  nextBillingDate: Date | null;
  invoicingCycle: InvoicingCycle;
  productType: string;
  contractStatus: string;
  orders: Order[];
  products: Product[];
  totalRevenueBigDecimal: number;
  totalCostBigDecimal: number;
}

export enum InvoicingCycle {
  OneTime = "One time",
  Quarterly = "Quarterly"
}

export interface Order {
  orderStartDate: Date;
  orderEndDate: Date;
  contractDuration: null;
  customerNoticePeriod: number;
  customerPo: null;
  quantity: number;
  customerSignatureDate: Date;
  quoteNumber: null;
  quoteConfirmation: null;
  vendorSalesOrderNumber: null;
  vendorNoticePeriod: null;
  nextBillingDate: null;
  customerSupportLevelCode: null;
  vendorSupportLevelCode: null;
  wbsNumber: string;
  orderRevenueAmount: string;
  orderCostAmount: string;
  costRevenueDetails: CostRevenueDetail[];
  statuses: Status[];
  regulations: any[];
  orderRevenueAmountBigDecimal: number;
  orderCostAmountBigDecimal: number;
}

export interface CostRevenueDetail {
  type: Type;
  percentage: number;
  licenseAmount: string;
  maintenanceBaseAmount: string;
  fee: string;
  totalContractAmount: string;
  currencyCode: CurrencyCode;
  invoicingDate: null;
  licenseAmountBigDecimal: number | null;
  maintenanceBaseAmountBigDecimal: number | null;
  invoicingCyclePeriodName: InvoicingCycle;
  totalContractAmountBigDecimal: null;
  feeBigDecimal: null;
}

export enum CurrencyCode {
  Dkk = "DKK",
  Eur = "EUR"
}

export enum Type {
  Cost = "Cost",
  Revenue = "Revenue"
}

export interface Status {
  type: string;
  name: string;
  description: null;
}

export interface Product {
  name: string;
  productType: string;
  vendorName: string;
  vendorRpiNumber: number;
  materials: Material[];
}

export interface Material {
  description: string;
  licenseKey: null;
}

export interface ThirdPartyNumber {
  name: string;
  number: string;
}
