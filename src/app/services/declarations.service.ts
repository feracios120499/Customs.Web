import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DeclarationHeader } from '../models/DeclarationHeaderModel';
import { Declaration } from '../models/DeclarationModel';
import { DeclarationViewModel } from '../models/DeclarationViewModel';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class DeclarationsService extends BaseService {
  /**
   *
   */
  constructor(private http: HttpClient) {
    super();
  }

  getDeclarations(filter: string = null): Observable<Array<DeclarationHeader>> {
    let prefix = '';
    if (filter) prefix = '?';
    this.triggerLoading(true);

    return this.http
      .get<Array<DeclarationHeader>>('declaration' + prefix + filter)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.triggerLoading(false))
      );
  }

  getDeclaration(id: string): Observable<DeclarationViewModel> {
    this.triggerLoading(true);
    return this.http.get<DeclarationViewModel>(`declaration/${id}`).pipe(
      catchError(this.handleError),
      finalize(() => this.triggerLoading(false))
    );
  }

  searchDeclaration(mawb: string): Observable<DeclarationHeader> {
    return this.http.get<DeclarationHeader>(`declaration/mawb/${mawb}`).pipe(
      catchError(this.handleError),
      finalize(() => {})
    );
  }
}
