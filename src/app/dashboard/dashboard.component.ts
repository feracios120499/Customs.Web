import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

import { DeclarationComponent } from '../declaration/declaration.component';
import { DeclarationHeader } from '../models/DeclarationHeaderModel';
import { ProfileModel } from '../models/ProfileModel';
import { AuthService } from '../services/auth.service';
import { DeclarationsService } from '../services/declarations.service';
import { OdataService } from '../services/odata.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private declarationService: DeclarationsService,
    private odataService: OdataService,
    private spinner: NgxSpinnerService,
    private modal: NgbModal) { }

  currentUser: Observable<ProfileModel>;
  declarationList: Array<DeclarationHeader>;
  selected: any = { startDate: moment().subtract(1, 'month'), endDate: moment() };
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(7, 'days'), moment()],
    'Last 30 Days': [moment().subtract(30, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')]
  };
  maxDate = moment();
  minDate = moment().subtract(3, 'years');
  search: string;
  public sortList = [
    {
      name: 'declarationDate',
      translate: 'Last added',
      direct: 'desc'
    },
    {
      name: 'consignorCountryCode',
      translate: 'Country',
      direct: 'desc'
    },
    {
      name: 'documentReference',
      translate: 'MAWB',
      direct: 'desc'
    },
    {
      name: 'conveyanceReference',
      translate: 'Flight number',
      direct: 'desc'
    }
  ];
  currentSort = this.sortList[0];
  ngOnInit(): void {
    this.declarationService.loading$.subscribe((loading) => {
      if (loading) {
        this.spinner.show();
      }
      else {
        this.spinner.hide();
      }
    });
    this.currentUser = this.authService.currentUser;
    // this.loadList();
  }
  openDetail(header: DeclarationHeader) {
    this.declarationService.getDeclaration(header.id).subscribe((response) => {
      const modalRef = this.modal.open(DeclarationComponent, { windowClass: 'declaration' });
      modalRef.componentInstance.declaration = response.declarationModel;
      modalRef.componentInstance.header = header;
      modalRef.result.then((response) => {
        console.log(response);
      },
        (reason) => {
          console.log(reason);
        });
    });

  }
  setSort(sort) {
    this.currentSort = sort;
    this.loadList();
  }
  datesUpdated($event) {
    console.log(this.selected);
    this.loadList();
  }

  loadList() {
    let filter = this.odataService.processFilter([{ dataType: 'date', name: 'declarationDate', dateFrom: this.selected.startDate._d, dateTo: this.selected.endDate._d }]);
    filter += '&$orderby=' + this.currentSort.name + ' ' + this.currentSort.direct;
    this.declarationService.getDeclarations(filter).subscribe((response) => {
      this.declarationList = response;
    });
  }
  logOut() {
    this.authService.logOut();
  }

  export(): void {
    this.declarationService.exportDeclarations(this.selected.startDate._d, this.selected.endDate._d)
      .subscribe(result => saveAs(result.Blob, result.FileName));
  }


}
