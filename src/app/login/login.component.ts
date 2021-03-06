import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { DeclarationHeader } from '../models/DeclarationHeaderModel';
import { AuthService } from '../services/auth.service';
import { DeclarationsService } from '../services/declarations.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private declarationService: DeclarationsService
  ) { }

  public uiMode = 'search';
  public isSearching = false;
  public searchFinished = false;
  public isClearing = false;
  public isValidSearch = false;

  public options: AnimationOptions = {
    path: '/assets/lottie/globe.json',
  };

  public email: string;
  public password: string;
  public search: string;

  public declarations: DeclarationHeader[] = null;
  public declaration: DeclarationHeader = null;

  public loading: Observable<boolean>;
  ngOnInit(): void {
    this.authService.loading$.subscribe((loading) => {
      if (loading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
    // this.search = '566-15050766';
    // this.searchFlight();
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  public logIn() {
    this.authService.loginByEmail(this.email, this.password).subscribe(
      (response) => {
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        this.toastr.error(error.error.Message || error, 'Error');
      }
    );
  }

  public searchFlight() {
    this.isSearching = true;

    this.declarationService.searchDeclaration(this.search).subscribe(
      (response) => {
        console.log(response);
        this.declarations = response;
        if (response && response.length !== 0) {
          this.declaration = response[0];
        }
      },
      (error) => {
        this.searchFinished = true;
        this.isSearching = false;
        this.toastr.error(error.error.Message || error, 'Error');
      },
      () => {
        this.searchFinished = true;
        this.isSearching = false;
      }
    );
  }

  public onSearchInputChange(event) {
    if (event.length === 12) {
      this.isValidSearch = true;
    } else {
      this.isValidSearch = false;
    }
    if (this.searchFinished) {
      this.isClearing = true;
      this.searchFinished = false;
      setTimeout(() => {
        this.isClearing = false;
        this.declarations = null;
        this.declaration = null;
      }, 1500);
    }
  }

  public clearSearch() {
    this.search = '';
    this.searchFinished = false;
    this.isClearing = true;
    setTimeout(() => {
      this.isClearing = false;
      this.declarations = null;
      this.declaration = null;
    }, 1500);
  }

  public setUIMode(mode: string) {
    if (mode === 'login') { this.clearSearch(); }
    this.uiMode = mode;
  }
}
