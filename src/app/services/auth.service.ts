import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { ProfileModel } from '../models/ProfileModel';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenResponse } from '../models/TokenResponse';


@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseService {

    private currentUserSubject: BehaviorSubject<ProfileModel>;
    public currentUser: Observable<ProfileModel>;
    constructor(private http: HttpClient, private route: Router) {
        super();
        this.currentUserSubject = new BehaviorSubject<ProfileModel>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): ProfileModel {
        return this.currentUserSubject.value;
    }

    loginByEmail(login: string, password: string): Observable<any> {
        const params = new HttpParams()
            .set('grant_type', "password")
            .set('username', login)
            .set("client_id",environment.clientId)
            .set('password', password);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };

        this.triggerLoading(true);
        return this.http.post<TokenResponse>("auth/token", params, httpOptions)
            .pipe(switchMap(token => {
                sessionStorage.setItem('userToken', JSON.stringify(token));
                return this.http.get<ProfileModel>("user/profile").pipe(map(result => {
                    sessionStorage.setItem('currentUser', JSON.stringify(result));
                    this.currentUserSubject.next(result);
                    return result;
                }));
            }
            ),
                catchError(this.handleError),
                finalize(() => this.triggerLoading(false))
            );
    }

    // changePassword(login: string, currentPassword: string, newPassword: string): Observable<any> {
    //     this.triggerLoading(true);
    //     return this.http.post<Result<any>>("admin/auth/changePassword", { userName: login, CurrentPassword: currentPassword, NewPassword: newPassword }).pipe(
    //         map(result => {
    //             if (result.StatusCode == 200) {
    //                 return;
    //             }
    //             throw new HttpErrorResponse({ error: result.ExceptionMessage || result.ErrorMessage, status: result.StatusCode });
    //         }),
    //         catchError(this.handleError),
    //         finalize(() => this.triggerLoading(false))
    //     );
    // }

    logOut() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('userToken');
        this.route.navigateByUrl('/login');
        this.currentUserSubject.next(null);
    }
}
