import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DialogMode } from '../../../../data/enums/dialog-mode.enum';
import { EmployeePosition } from '../../../../data/enums/employee-position.enum';
import { Employee } from '../../../../data/models/employee.model';
import { SpinnerLoadComponent } from '../../../../shared/components/spinner-load/spinner-load.component';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { EmployeesService } from '../../services/employees.service';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SpinnerLoadComponent,
    AsyncPipe,
  ],
  providers: [TitleCasePipe, SpinnerService, EmployeesService],
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.scss',
})
export class EmployeeDialogComponent implements OnInit {
  form: FormGroup;
  isDisabledInput: boolean = true;
  opcionesPosicion = [
    { id: 0, description: 'Junior' },
    { id: 1, description: 'Senior' },
    { id: 2, description: 'Other' },
  ];

  constructor(
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      employee: Employee;
      mode: DialogMode;
      disabled?: boolean;
    },
    private readonly fb: FormBuilder,
    readonly spinnerService: SpinnerService,
    private readonly employeeService: EmployeesService
  ) {
    this.form = this.fb.group({
      name: [
        { value: '', disabled: this.data.disabled },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      surname: [
        { value: '', disabled: this.data.disabled },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      birthDate: [
        { value: '', disabled: this.data.disabled },
        Validators.required,
      ],
      position: [
        { value: '', disabled: this.data.disabled },
        Validators.required,
      ],
      positionDescription: [{ value: '', disabled: this.data.disabled }],
    });
    this.isDisabledInput = !this.data?.employee?.positionDescription;
  }

  ngOnInit(): void {
    this.setForm();
    this.listener();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.data.mode === DialogMode.ADD
        ? this.saveEmployee(this.form.value)
        : this.updateEmployee(
            Object.assign(this.form.value, { id: this.data.employee.id })
          );
    }
  }

  private setForm(): void {
    this.form.patchValue(this.data.employee);
  }

  private listener(): void {
    this.positionFormControl.valueChanges.subscribe((position) => {
      if (position === EmployeePosition.OTHER) {
        this.isDisabledInput = false;
        this.setValidators([Validators.required]);
      } else {
        this.isDisabledInput = true;
        this.positionDescriptionFormControl.patchValue(null);
        this.setValidators(null);
      }
    });
  }

  private saveEmployee(employee: Employee): void {
    this.spinnerService.show();
    this.employeeService.saveEmployee(employee).subscribe((employee) => {
      if (employee) this.dialogRef.close(employee);
      this.spinnerService.hide();
    });
  }

  private updateEmployee(employee: Employee): void {
    this.spinnerService.show();
    this.employeeService.updateEmployee(employee).subscribe((employee) => {
      if (employee) this.dialogRef.close(employee);
      this.spinnerService.hide();
    });
  }

  setValidators(validators: ValidatorFn[] | null): void {
    this.positionDescriptionFormControl?.setValidators(validators);
    this.positionDescriptionFormControl?.updateValueAndValidity();
  }

  getErrorMessage(formControlName: string): string {
    if (formControlName === 'name') {
      if (this.nameFormControl.hasError('required'))
        return 'You must enter a value';

      if (
        this.nameFormControl.hasError('minlength') ||
        this.nameFormControl.hasError('maxlength')
      )
        return 'The name must be between 3 and 20 characters';
    }

    if (formControlName === 'surname') {
      if (this.surnameFormControl.hasError('required'))
        return 'You must enter a value';

      if (
        this.surnameFormControl.hasError('minlength') ||
        this.surnameFormControl.hasError('maxlength')
      )
        return 'The surname must be between 3 and 20 characters';
    }
    if (formControlName === 'description') {
      if (this.surnameFormControl.hasError('required'))
        return 'You must enter a value';
    }

    return 'Invalid Value';
  }

  get nameFormControl() {
    return this.form.get('name') as FormControl;
  }
  get surnameFormControl() {
    return this.form.get('surname') as FormControl;
  }
  get birthDateFormControl() {
    return this.form.get('birthDate') as FormControl;
  }
  get positionFormControl() {
    return this.form.get('position') as FormControl;
  }
  get positionDescriptionFormControl() {
    return this.form.get('positionDescription') as FormControl;
  }
}
