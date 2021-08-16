import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { DeclarationHeader } from '../models/DeclarationHeaderModel';
import { DeclarationViewModel } from '../models/DeclarationViewModel';
import { ExportFile } from '../models/ExportFileModel';
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
    if (filter) { prefix = '?'; }
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

  searchDeclaration(mawb: string): Observable<Array<DeclarationHeader>> {
    return this.http.get<Array<DeclarationHeader>>(`declaration/mawb/${mawb}`).pipe(
      catchError(this.handleError),
      finalize(() => { })
    );
  }

  exportDeclarations(dateStart: Date, dateEnd: Date): Observable<ExportFile> {
    this.triggerLoading(true);
    return this.http.get(`declaration/export?dateStart=${this.formatDate(dateStart)}&dateEnd=${this.formatDate(dateEnd)}`, { responseType: 'blob', observe: 'response' }).pipe(
      map(res => {
        const model = new ExportFile();
        model.Blob = res.body;
        model.FileName = this.getFileNameFromHttpResponse(res);
        return model;
      }),
      catchError(this.handleError),
      finalize(() => this.triggerLoading(false)));
  }

  private formatDate(dateStr) {
    const date = new Date(dateStr);
    const d = date.getDate();
    const m = date.getMonth() + 1; // Month from 0 to 11
    const y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  private getFileNameFromHttpResponse(httpResponse) {
    const contentDispositionHeader = httpResponse.headers.get('Content-Disposition');
    const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    return result.replace(/"/g, '');
  }
}
