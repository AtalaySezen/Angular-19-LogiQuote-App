import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { DataService } from '../../shared/services/data.service';
import { Offer } from '../../shared/models/general.model';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../shared/services/notification.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-offer',
  imports: [NzButtonModule, NzFormModule, NzToolTipModule, CommonModule, FormsModule, ReactiveFormsModule, NzAutocompleteModule, NzInputModule, NzSelectModule],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss'
})

export class OfferComponent {
  dataService = inject(DataService);
  NotificationService = inject(NotificationService);
  fb = inject(FormBuilder);
  offerForm!: FormGroup;

  countriesCities = [
    { country: 'USA', city: 'New York' },
    { country: 'USA', city: 'Los Angeles' },
    { country: 'USA', city: 'Miami' },
    { country: 'USA', city: 'Minnesota' },
    { country: 'China', city: 'Beijing' },
    { country: 'China', city: 'Shanghai' },
    { country: 'Turkey', city: 'Istanbul' },
    { country: 'Turkey', city: 'Izmir' },
  ];
  filteredCities: string[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.loadCities();
  }

  initializeForm() {
    this.offerForm = this.fb.group({
      mode: [null, Validators.required],
      movementType: [null, Validators.required],
      incoterms: [null, Validators.required],
      countryCity: [null, [Validators.required, this.cityValidator()]],
      packageType: [null, Validators.required],
      unit1: [null, Validators.required],
      unit1Value: [null, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      unit2: [null, Validators.required],
      unit2Value: [null, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      currency: [null, Validators.required],
      palletCount: [null]
    });


    this.offerForm.get('countryCity')?.valueChanges.subscribe((value) => {
      this.filteredCities = this.filterCities(value);
    });
  }

  loadCities() {
    this.filteredCities = this.countriesCities.flatMap(item => `${item.country} - ${item.city}`);
  }

  cityValidator(): ValidatorFn {
    const validCities = this.countriesCities.map(item => `${item.country} - ${item.city}`);
    return (control: AbstractControl): ValidationErrors | null =>
      validCities.includes(control.value) ? null : { invalidCity: true };
  }

  filterCities(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    return this.countriesCities
      .filter(item =>
        `${item.country} - ${item.city}`.toLowerCase().includes(lowerQuery)
      )
      .map(item => `${item.country} - ${item.city}`);
  }

  calculatePallets(): void {
    const mode = this.offerForm.get('mode')?.value;
    const packageType = this.offerForm.get('packageType')?.value;
    const unitType = this.offerForm.get('unit1')?.value;
    const unit1Value = this.offerForm.get('unit1Value')?.value;
    const cmToInchConversionFactor = 2.54;

    this.dataService.GetDimensions().subscribe((data) => {
      const { carton, box, pallet } = data.data;

      const productAreaInches = this.convertUnitToInches(unitType, unit1Value, cmToInchConversionFactor);
      let palletCount = this.calculatePackagePalletCount(packageType, productAreaInches, carton, box, pallet);

      if (this.isModeInvalid(mode, palletCount)) {
        return;
      }

      this.saveOffer();
    });
  }

  convertUnitToInches(unitType: string, unit1Value: number, conversionFactor: number): number {
    return unitType === 'IN' ? unit1Value * conversionFactor : unit1Value;
  }

  calculatePackagePalletCount(packageType: string, productAreaInches: number, carton: any, box: any, pallet: any): number {
    if (!carton || !box || !pallet) {
      console.error('Invalid package type provided.');
      return 0;
    }

    let palletCount = 0;

    switch (packageType) {
      case 'Cartons':
        const cartonsPerBox = this.calculateCartonsPerBox(carton, box);
        palletCount = cartonsPerBox > 0 ? Math.ceil(productAreaInches / cartonsPerBox) : 0;
        break;
      case 'Boxes':
        const boxesPerPallet = this.calculateBoxesPerPallet(box, pallet);
        palletCount = boxesPerPallet > 0 ? Math.ceil(productAreaInches / boxesPerPallet) : 0;
        break;
      case 'Pallets':
        palletCount = 1;
        break;
      default:
        console.error('Invalid package type provided.');
        return 0;
    }

    this.offerForm.get('palletCount')?.setValue(palletCount);
    return palletCount;
  }


  calculateCartonsPerBox(carton: any, box: any): number {
    return Math.trunc(box.width / carton.width) *
      Math.trunc(box.length / carton.length) *
      Math.trunc(box.height / carton.height);
  }

  calculateBoxesPerPallet(box: any, pallet: any): number {
    return Math.trunc(pallet.width / box.width) *
      Math.trunc(pallet.length / box.length) *
      Math.trunc(pallet.height / box.height);
  }

  isModeInvalid(mode: string, palletCount: number): boolean {
    if (mode === 'LCL' && palletCount >= 24) {
      this.NotificationService.createNotification('warning', 'Warning', 'If LCL mode is selected, you cannot ship 24 or more pallets. Please select FCL.');
      return true;
    } else if (mode === 'FCL' && palletCount > 24) {
      this.NotificationService.createNotification('warning', 'Warning', 'If FCL mode is selected, you cannot ship more than 24 pallets.');
      return true;
    }
    return false;
  }

  submitForm() {
    if (this.offerForm.valid) {
      this.calculatePallets();
    } else {
      console.error('Form Invalid');
    }
  }

  saveOffer(): void {
    if (this.offerForm.valid) {
      const offerData: Offer = this.offerForm.value;

      this.dataService.SaveOfferData(offerData).subscribe({
        next: (data: Offer) => {
          if (data.status === 'success') {
            this.NotificationService.createNotification('success', 'Success', 'Offer successfully saved');
          } else {
            this.NotificationService.createNotification('error', 'Error', 'Offer could not be saved');
          }
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    } else {
      console.error('Form Invalid');
    }
  }

}
