import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  public email: string;
  public password: string;
  public loading: Observable<boolean>;
  ngOnInit(): void {
    this.authService.loading$.subscribe((loading) => {
      if (loading) {
        this.spinner.show();
      }
      else {
        this.spinner.hide();
      }
    });
  }

  public logIn() {
    this.authService.loginByEmail(this.email, this.password).subscribe((response) => {
      this.router.navigateByUrl('/dashboard');
    }
      , (error) => {
        this.toastr.error(error.error.Message || error, "Error");
      }
    )

  }

}
