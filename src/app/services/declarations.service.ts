import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DeclarationHeader } from "../models/DeclarationHeaderModel";
import { Declaration } from "../models/DeclarationModel";
import { DeclarationViewModel } from "../models/DeclarationViewModel";
import { BaseService } from "./base.service";

@Injectable({
    providedIn: 'root'
})
export class DeclarationsService extends BaseService {

    /**
     *
     */
    constructor(private http: HttpClient) {
        super();

    }

    getDeclarations(): Observable<Array<DeclarationHeader>> {
        return this.http.get<Array<DeclarationHeader>>("declaration");
    }
}