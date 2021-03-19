import { Declaration } from "./DeclarationModel";

export interface DeclarationViewModel {
    id: string;
    errorCode: number;
    declaration: Declaration;
    errorMessage?: any;
    customsId?: any;
    dateRequest: Date;
}

