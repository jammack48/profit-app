export interface QuoteLineItem {
  id: string;
  name: string;
  type: 'labour' | 'material';
  quantity: number;
  cost: number;
  price: number;
  markup: number;
  tax: number;
  discount: number;
  isBigTicket?: boolean;
  maxMarkup?: number;
}

export interface QuoteData {
  lineItems: QuoteLineItem[];
  gstRate: number;
}

export interface MarginSettings {
  labourMargin: number;
  materialMargin: number;
  bigTicketMargins: { [itemId: string]: number };
}

export interface CalculatedResults {
  subtotal: number;
  gstAmount: number;
  total: number;
  totalCost: number;
  grossProfit: number;
  grossProfitPercentage: number;
}