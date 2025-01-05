export interface TaxBracket {
  max?: number;
  min: number;
  rate: number;
}

export interface FetchTaxRatesResponse {
  tax_brackets: TaxBracket[];
}
