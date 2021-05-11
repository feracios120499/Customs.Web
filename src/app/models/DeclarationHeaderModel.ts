export interface Country {
  name: string;
  code: string;
}

export interface DeclarationHeader {
  id: string;
  conveyanceReference: string;
  documentReference: string;
  consigneeCountryCode: string;
  consigneeCountryName: string;
  consignorCountryCode: string;
  consignorCountryName: string;
  declarationDate: Date;
  statusCode: string;
  createDate: Date;
  customsId: string;
  airCompanyCode?: string;
}
