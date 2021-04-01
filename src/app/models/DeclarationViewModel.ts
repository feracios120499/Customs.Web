import { Declaration } from "./DeclarationModel";

export interface DeclarationViewModel {
    id: string;
    errorCode: number;
    declarationModel: Declaration;
    errorMessage?: any;
    customsId?: any;
    dateRequest: Date;
}

