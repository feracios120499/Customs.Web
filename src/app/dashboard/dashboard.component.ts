import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DeclarationHeader } from '../models/DeclarationHeaderModel';
import { DeclarationViewModel } from '../models/DeclarationViewModel';
import { ProfileModel } from '../models/ProfileModel';
import { AuthService } from '../services/auth.service';
import { DeclarationsService } from '../services/declarations.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService, private declarationService: DeclarationsService) { }

  currentUser: Observable<ProfileModel>;
  declarationList: Array<DeclarationHeader>;
  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.declarationService.getDeclarations().subscribe((response) => {
      this.declarationList = response;
    })
  }

}
