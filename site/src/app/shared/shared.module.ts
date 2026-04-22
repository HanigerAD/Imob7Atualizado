import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { AllowDecimalNumberDirective } from './directives/allow-decimal.directive';

@NgModule({
  declarations: [
    PaginationComponent,
    AllowDecimalNumberDirective,
  ],
  providers: [
    CurrencyPipe
  ],
  exports: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class SharedModule { }
