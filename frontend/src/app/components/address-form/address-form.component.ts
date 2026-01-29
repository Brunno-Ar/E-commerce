import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddressDTO } from '../../models/address.model';
import { AddressType } from '../../enums/address-type.enum';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card class="address-form-card">
      <mat-card-header>
        <mat-card-title>{{ isEditing ? 'Editar Endereço' : 'Novo Endereço' }}</mat-card-title>
        <button *ngIf="isEditing" mat-icon-button (click)="onCancel.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="addressForm" (ngSubmit)="onSubmit()">
          <!-- Address Type -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tipo de Endereço</mat-label>
            <mat-select formControlName="type">
              <mat-option value="BILLING">Cobrança</mat-option>
              <mat-option value="SHIPPING">Entrega</mat-option>
              <mat-option value="BOTH">Ambos</mat-option>
            </mat-select>
            <mat-error *ngIf="addressForm.get('type')?.hasError('required')">
              Tipo de endereço é obrigatório
            </mat-error>
          </mat-form-field>

          <!-- Recipient Name -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome do Destinatário</mat-label>
            <input matInput formControlName="recipient" placeholder="Ex: João Silva">
            <mat-error *ngIf="addressForm.get('recipient')?.hasError('required')">
              Nome do destinatário é obrigatório
            </mat-error>
          </mat-form-field>

          <!-- Street and Number -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="street-field">
              <mat-label>Rua</mat-label>
              <input matInput formControlName="street" placeholder="Nome da rua">
              <mat-error *ngIf="addressForm.get('street')?.hasError('required')">
                Rua é obrigatória
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="number-field">
              <mat-label>Número</mat-label>
              <input matInput formControlName="number" placeholder="123">
              <mat-error *ngIf="addressForm.get('number')?.hasError('required')">
                Número é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Complement -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Complemento</mat-label>
            <input matInput formControlName="complement" placeholder="Apto 101, Bloco A">
          </mat-form-field>

          <!-- Neighborhood and CEP -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="neighborhood-field">
              <mat-label>Bairro</mat-label>
              <input matInput formControlName="neighborhood" placeholder="Centro">
              <mat-error *ngIf="addressForm.get('neighborhood')?.hasError('required')">
                Bairro é obrigatório
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="cep-field">
              <mat-label>CEP</mat-label>
              <input matInput 
                     formControlName="zipCode" 
                     placeholder="00000-000"
                     (input)="formatCEP($event)">
              <mat-error *ngIf="addressForm.get('zipCode')?.hasError('required')">
                CEP é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <!-- City and State -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="city-field">
              <mat-label>Cidade</mat-label>
              <input matInput formControlName="city" placeholder="São Paulo">
              <mat-error *ngIf="addressForm.get('city')?.hasError('required')">
                Cidade é obrigatória
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="state-field">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="state">
                <mat-option value="AC">Acre</mat-option>
                <mat-option value="AL">Alagoas</mat-option>
                <mat-option value="AP">Amapá</mat-option>
                <mat-option value="AM">Amazonas</mat-option>
                <mat-option value="BA">Bahia</mat-option>
                <mat-option value="CE">Ceará</mat-option>
                <mat-option value="DF">Distrito Federal</mat-option>
                <mat-option value="ES">Espírito Santo</mat-option>
                <mat-option value="GO">Goiás</mat-option>
                <mat-option value="MA">Maranhão</mat-option>
                <mat-option value="MT">Mato Grosso</mat-option>
                <mat-option value="MS">Mato Grosso do Sul</mat-option>
                <mat-option value="MG">Minas Gerais</mat-option>
                <mat-option value="PA">Pará</mat-option>
                <mat-option value="PB">Paraíba</mat-option>
                <mat-option value="PR">Paraná</mat-option>
                <mat-option value="PE">Pernambuco</mat-option>
                <mat-option value="PI">Piauí</mat-option>
                <mat-option value="RJ">Rio de Janeiro</mat-option>
                <mat-option value="RN">Rio Grande do Norte</mat-option>
                <mat-option value="RS">Rio Grande do Sul</mat-option>
                <mat-option value="RO">Rondônia</mat-option>
                <mat-option value="RR">Roraima</mat-option>
                <mat-option value="SC">Santa Catarina</mat-option>
                <mat-option value="SP">São Paulo</mat-option>
                <mat-option value="SE">Sergipe</mat-option>
                <mat-option value="TO">Tocantins</mat-option>
              </mat-select>
              <mat-error *ngIf="addressForm.get('state')?.hasError('required')">
                Estado é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Reference Point -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Ponto de Referência</mat-label>
            <input matInput formControlName="referencePoint" 
                   placeholder="Próximo ao shopping centro">
          </mat-form-field>

          <!-- Default Address Checkbox -->
          <mat-checkbox formControlName="isDefault" class="default-checkbox">
            Definir como endereço padrão para este tipo
          </mat-checkbox>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-stroked-button (click)="onCancel.emit()" type="button">
          Cancelar
        </button>
        <button mat-raised-button 
                color="primary" 
                (click)="onSubmit()" 
                [disabled]="addressForm.invalid">
          {{ isEditing ? 'Salvar Alterações' : 'Adicionar Endereço' }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent {
  @Input() address?: AddressDTO;
  @Output() save = new EventEmitter<AddressDTO>();
  @Output() cancel = new EventEmitter<void>();

  addressForm: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      type: ['SHIPPING', Validators.required],
      recipient: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      country: ['Brasil'],
      referencePoint: [''],
      isDefault: [false]
    });
  }

  ngOnInit() {
    if (this.address) {
      this.isEditing = true;
      this.addressForm.patchValue(this.address);
    }
  }

  onSubmit() {
    if (this.addressForm.valid) {
      const addressData: AddressDTO = {
        id: this.address?.id,
        ...this.addressForm.value
      };
      this.save.emit(addressData);
    }
  }

  formatCEP(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    this.addressForm.get('zipCode')?.setValue(value, { emitEvent: false });
  }
}