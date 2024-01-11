import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from '../../../../app.component';
import { EmployeePosition } from '../../../../data/enums/employee-position.enum';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { EmployeesService } from '../../services/employees.service';
import { EmployeeDialogComponent } from './employee-dialog.component';

describe('EmployeeDialogComponent', () => {
  let component: EmployeeDialogComponent;
  let fixture: ComponentFixture<EmployeeDialogComponent>;
  let mockData: any;
  let mockEmployeeService: jasmine.SpyObj<EmployeesService>;
  let mockSpinnerService: jasmine.SpyObj<SpinnerService>;

  beforeEach(() => {
    mockData = {
      title: 'Test Title',
      employee: {
        id: 1,
        name: 'John',
        surname: 'Doe',
        birthDate: '1990-01-01',
        position: 0,
      },
      mode: 'ADD',
      disabled: false,
    };
    mockEmployeeService = jasmine.createSpyObj('EmployeesService', [
      'saveEmployee',
    ]);
    mockSpinnerService = jasmine.createSpyObj('SpinnerService', [
      'show',
      'hide',
    ]);
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        EmployeeDialogComponent,
        AppComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialog, useValue: {} },
        { provide: EmployeesService, useValue: mockEmployeeService },
        { provide: SpinnerService, useValue: mockSpinnerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set form values', () => {
    expect(component.form.get('name')?.value).toBe(mockData.employee.name);
    expect(component.form.get('surname')?.value).toBe(
      mockData.employee.surname
    );
    expect(component.form.get('birthDate')?.value).toBe(
      mockData.employee.birthDate
    );
    expect(component.form.get('position')?.value).toBe(
      mockData.employee.position
    );
  });

  it('should disable input based on employee position', () => {
    component.positionFormControl.setValue(EmployeePosition.JUNIOR);
    expect(component.isDisabledInput).toBeTruthy();

    component.positionFormControl.setValue(EmployeePosition.OTHER);
    expect(component.isDisabledInput).toBeFalsy();
  });
});
