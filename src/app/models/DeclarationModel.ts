export interface Interchange {
    version: string;
    senderID: string;
    recipientID: string;
    interchangeReference: string;
    msgType: string;
    date: string;
    time: string;
    testIndicator: string;
    dateTime: Date;
}

export interface Contact {
    name: string;
    email: string;
    phone: string;
}

export interface LodgingPerson {
    tin: string;
    contact: Contact;
}

export interface Itinerary {
    countryCode: string;
}

export interface Consignor {
    name: string;
    address: string;
    country: string;
    zipCode: string;
    city: string;
}

export interface Consignee {
    name: string;
    address: string;
    country: string;
    zipCode: string;
    city: string;
}

export interface Package {
    marks: string;
    kindOfPackage: string;
    numberOfPackages: string;
}

export interface ProducedDocument {
    documentType: string;
    documentReference: string;
}

export interface GoodsItem {
    itemNumber: string;
    commercialReferenceNumber: string;
    description: string;
    grossWeight: string;
    placeOfLoading: string;
    consignor: Consignor;
    consignee: Consignee;
    package: Package[];
    producedDocument: ProducedDocument[];
}

export interface CustOfficeOfFirstEntry {
    refNum: string;
    expectedDateTimeOfArrival: string;
}

export interface EntrySummaryDeclaration {
    localReferenceNumber: string;
    totalNumberOfItems: string;
    totalNumberOfPackages: string;
    transportModeAtBorder: string;
    conveyanceRefNum: string;
    placeOfUnloading: string;
    totalGrossWeight: string;
    declDateTime: string;
    declPlace: string;
    lodgingPerson: LodgingPerson;
    itinerary: Itinerary[];
    goodsItem: GoodsItem[];
    custOfficeOfFirstEntry: CustOfficeOfFirstEntry;
}

export interface Declaration {
    interchange: Interchange;
    entrySummaryDeclaration: EntrySummaryDeclaration;
}