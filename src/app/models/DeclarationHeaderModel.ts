export interface Country {
    name: string;
    code: string;
}

export interface DeclarationHeader {
    id: string;
    conveyanceReference: string;
    documentReference: string;
    consignorCountry: Country;
    consigneeCountry: Country;
    declarationDate: Date;
    statusCode: string;
}