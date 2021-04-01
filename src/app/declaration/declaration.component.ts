import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeclarationHeader } from '../models/DeclarationHeaderModel';
import { Declaration, GoodsItem } from '../models/DeclarationModel';
import { DeclarationViewModel } from '../models/DeclarationViewModel';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.scss']
})
export class DeclarationComponent implements OnInit {

  @Input() declaration: Declaration;
  @Input() header: DeclarationHeader;
  currentIndex = 0;
  currentItem: GoodsItem;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.declaration);
    this.currentItem = this.declaration.entrySummaryDeclaration.goodsItem[this.currentIndex];
  }

  previous() {
    if (this.currentIndex == 0) {
      return;
    }
    this.currentIndex--;
    this.currentItem = this.declaration.entrySummaryDeclaration.goodsItem[this.currentIndex];
  }
  next() {
    if (this.currentIndex == this.declaration.entrySummaryDeclaration.goodsItem.length - 1) {
      return;
    }
    this.currentIndex++;
    this.currentItem = this.declaration.entrySummaryDeclaration.goodsItem[this.currentIndex];
  }
}
