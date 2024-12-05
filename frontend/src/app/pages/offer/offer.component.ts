import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { DataService } from '../../shared/services/data.service';
import { Offer } from '../../shared/models/general.model';

@Component({
  selector: 'app-offer',
  imports: [NzButtonModule, NzFormModule, FormsModule, ReactiveFormsModule, NzAutocompleteModule, NzInputModule, NzSelectModule],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss'
})

export class OfferComponent {
  dataService = inject(DataService);
  fb = inject(FormBuilder);
  offerForm!: FormGroup;
  countriesCities: string[] = [
    'USA - New York',
    'USA - Los Angeles',
    'USA - Miami',
    'USA - Minnesota',
    'China - Beijing',
    'China - Shanghai',
    'Turkey - Istanbul',
    'Turkey - Izmir',
  ];
  filteredCities: string[] = [];

  ngOnInit(): void {
    this.offerForm = this.fb.group({
      mode: [null, Validators.required],
      movementType: [null, Validators.required],
      incoterms: [null, Validators.required],
      countryCity: [null, [Validators.required, this.cityValidator(this.countriesCities)],],
      packageType: [null, Validators.required],
      unit1: [null, Validators.required],
      unit2: [null, Validators.required],
      currency: [null, Validators.required],
    });

    this.offerForm.get('countryCity')?.valueChanges.subscribe((value) => {
      this.filteredCities = this.filterCities(value);
    });
  }

  cityValidator(validCities: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || validCities.includes(control.value)) {
        return null;
      }
      return { invalidCity: true };
    };
  }

  filterCities(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    return this.countriesCities.filter((city) =>
      city.toLowerCase().includes(lowerQuery)
    );
  }

  saveOffer(): void {
    if (this.offerForm.valid) {
      const offerData: Offer = this.offerForm.value;
      this.dataService.SaveOfferData(offerData).subscribe({
        next: (data: Offer) => {
          if (data.status == 'success') {
            console.log(data);
          } else {
            console.log(data);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      console.error('Form Invalid');
    }
  }


}
