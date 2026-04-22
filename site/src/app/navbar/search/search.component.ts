import { Component, Input, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Options } from '@angular-slider/ngx-slider';
import { LoginModel } from '../../shared/model/login.model';
import { Subscription } from 'rxjs';
import { SearchService } from './services/search.service';
import { CityModel } from './model/city.model';
import { NeighborhoodModel } from './model/neighborhood.model';
import { SearchTabsEnum } from './enum/search-tabs.enum';
import { FinalityModel } from './model/finality.model';
import { TypeModel } from './model/type.model';
import { PropertyZoneEnum } from './enum/property-zone.enum';
import { SearchModel } from './model/search.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  @Input()
  public siteInfo: LoginModel;

  public searchForm: FormGroup;
  public optionsSlider: Options;
  public filters: SearchModel;
  public finalities: FinalityModel[] = [];
  public types: TypeModel[] = [];
  public cities: CityModel[] = [];
  public neighborhoods: NeighborhoodModel[] = [];
  public filteredNeighborhoods: NeighborhoodModel[] = [];
  public selectedNeighborhoods: NeighborhoodModel[] = [];
  public activatedTab: SearchTabsEnum = SearchTabsEnum.URBAN;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  @ViewChild('neighborhoodInput') neighborhoodInput: ElementRef<HTMLInputElement>;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private service: SearchService,
    private formBuilder: FormBuilder
  ) { }

  private keepSearchFilters(): void {
    this.filters = this.searchForm.getRawValue();

  }


  public ngOnInit(): void {
    this.generateForm();
    this.configureSlider();
    this.getFinalities();
    this.getTypes();
    this.getCities();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private generateForm(): void {
    this.searchForm = this.formBuilder.group({
      finality: 0,
      type: 0,
      city: 0,
      neighborhood: [[0]],
      internalCode: null,
      minPrice: '',
      maxPrice: '',
      category: 0,
      zone: 0,
    });
  }

  transformCurrency(keyFormattedCurrency) {
    const value = this.searchForm.get(keyFormattedCurrency).value;

    this.searchForm.get(keyFormattedCurrency).setValue(
      this.formatMoney(value),
      { emitEvent: false }
    );
  }

  formatMoney(value) {
    let temp = String(value).trim();

    temp = temp.replace(/\D/g, "");
    temp = temp.replace(/(\d)$/, "$1");
    temp = temp.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return temp;
  }

  public changeTab(activatedTab: string): void {
    if (activatedTab !== SearchTabsEnum.CODE) {
      this.searchForm.get('internalCode').setValue(null);
    }

    this.activatedTab = SearchTabsEnum[activatedTab];
  }

  private getFinalities(): void {
    this.subscriptions.add(
      this.service.getFinalities().subscribe(
        finalities => this.finalities = finalities
      )
    );
  }

  private getTypes(): void {
    this.subscriptions.add(
      this.service.getTypes().subscribe(
        types => this.types = types
      )
    );
  }

  private getCities(): void {
    this.subscriptions.add(
      this.service.getCities().subscribe(
        cities => this.cities = cities
      )
    );
  }

  public getNeighborhoods(): void {
    this.subscriptions.add(
      this.service.getNeighborhoods(this.searchForm.get('city').value).subscribe(
        neighborhoods => {
          this.neighborhoods = neighborhoods;
          this.filteredNeighborhoods = neighborhoods;
          // Clear selected neighborhoods when city changes
          this.selectedNeighborhoods = [];
          this.updateNeighborhoodFormValue();
        }
      )
    );
  }

  public removeNeighborhood(neighborhood: NeighborhoodModel): void {
    const index = this.selectedNeighborhoods.findIndex(n => n.code === neighborhood.code);
    if (index >= 0) {
      this.selectedNeighborhoods.splice(index, 1);
      this.updateNeighborhoodFormValue();
      // Reset input field after removing
      if (this.neighborhoodInput) {
        this.neighborhoodInput.nativeElement.value = '';
      }
    }
  }

  public selectNeighborhood(event: MatAutocompleteSelectedEvent): void {
    const neighborhood = event.option.value as NeighborhoodModel;
    if (!this.selectedNeighborhoods.find(n => n.code === neighborhood.code)) {
      this.selectedNeighborhoods.push(neighborhood);
      this.updateNeighborhoodFormValue();
    }
    // Clear the input field after selection
    if (this.neighborhoodInput) {
      this.neighborhoodInput.nativeElement.value = '';
      // Remove focus to the input to allow multiple selections
      this.neighborhoodInput.nativeElement.blur();
    }
  }

  private updateNeighborhoodFormValue(): void {
    this.searchForm.patchValue({
      neighborhood: this.selectedNeighborhoods.map(n => n.code)
    });
   
  }

  public search(): void {
    this.manageSelectedValues();

    this.filters = this.searchForm.getRawValue();
    this.filters.neighborhood = this.filters.neighborhood.length > 0 ? this.filters.neighborhood : [0]

    this.service.saveFiltersStorage(this.filters);
    this.service.redirectToListProperties();
  }

  private manageSelectedValues(): void {
    switch (this.activatedTab) {
      case SearchTabsEnum.URBAN: {
        this.searchForm.get('zone').setValue(PropertyZoneEnum.URBAN);
        break;
      }

      case SearchTabsEnum.RURAL: {
        this.searchForm.get('zone').setValue(PropertyZoneEnum.RURAL);
        break;
      }

      default:
        break;
    }
  }

  private configureSlider(): void {
    this.optionsSlider = {
      floor: 0,
      ceil: 10000000,
      animate: true,
      translate: (value: number): string => {
        return 'R$' + (this.roundValue(value)).toLocaleString();
      },
      combineLabels: (minValue: string, maxValue: string): string => {
        return `${minValue} - ${maxValue}`;
      }
    };
  }

  private roundValue(value: number): number {
    return Math.trunc(Math.round(value * 100) / 1000000) * 10000;
  }

}
