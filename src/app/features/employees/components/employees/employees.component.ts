import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import {
  Subject,
  debounceTime,
  delay,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { DialogMode } from '../../../../data/enums/dialog-mode.enum';
import { EmployeePosition } from '../../../../data/enums/employee-position.enum';
import { Role } from '../../../../data/enums/role.enum';
import { Employee } from '../../../../data/models/employee.model';
import { SpinnerLoadComponent } from '../../../../shared/components/spinner-load/spinner-load.component';
import { AgePipe } from '../../../../shared/pipes/age.pipe';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { RoleService } from '../../../role/services/role.service';
import { EmployeesService } from '../../services/employees.service';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';

export enum TableColumns {
  Name = 'Name',
  Surname = 'Surname',
  BirthDate = 'BirthDate',
  Position = 'Position',
  Edit = 'Edit',
}
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatTableModule,
    TitleCasePipe,
    CommonModule,
    AgePipe,
    EmployeeDialogComponent,
    MatDialogModule,
    SpinnerLoadComponent,
  ],
  providers: [EmployeesService, TitleCasePipe],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  readonly role = inject(RoleService);
  private readonly employeeService = inject(EmployeesService);
  private titleCasePipe = inject(TitleCasePipe);
  private roleService = inject(RoleService);
  readonly dialog = inject(MatDialog);
  readonly spinnerService = inject(SpinnerService);
  readonly search$ = new Subject<string>();
  readonly tableColumns = TableColumns;
  employees: Employee[] = [];

  displayedColumns: string[] = [
    TableColumns.Name.toString(),
    TableColumns.Surname.toString(),
    TableColumns.BirthDate.toString(),
    TableColumns.Position.toString(),
  ];

  ngOnInit(): void {
    this.role.userRole$.subscribe();
    this.loadInitialData();
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((word: string) =>
          word
            ? this.employeeService.getEmployeesByWord(word)
            : this.employeeService.getEmployees()
        )
      )
      .subscribe((employees) => (this.employees = employees));
  }

  search(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.search$.next(element.value);
  }

  private loadInitialData(): void {
    this.spinnerService.show();
    this.employeeService
      .getEmployees()
      .pipe(delay(1000))
      .subscribe((employees) => {
        this.employees = employees;
        this.spinnerService.hide();
      });
  }

  openEmployeeDetails(row?: Employee): void {
    const [title, mode, disabled] = this.getDialogData(row);

    this.dialog
      .open(EmployeeDialogComponent, {
        width: '50%',
        height: '40%',
        minWidth: '50%',
        minHeight: '40%',
        data: {
          title,
          employee: row,
          mode,
          disabled,
        },
      })
      .afterClosed()
      .subscribe((employee) => {
        if (employee) {
          this.employees =
            mode === DialogMode.EDIT
              ? this.employees.map((item) =>
                  item.id === employee.id ? employee : item
                )
              : (this.employees = [...this.employees, employee]);
        }
      });
  }

  private getDialogData(
    employee?: Employee
  ): [title: string, mode: DialogMode, disabled: boolean] {
    let title: string;
    const mode = employee ? DialogMode.EDIT : DialogMode.ADD;
    const disabled = this.role.userRole$.getValue() === Role.USER;

    if (this.roleService.userRole$.getValue() === Role.USER && employee) {
      title = `${this.titleCasePipe.transform(
        employee.surname
      )}, ${this.titleCasePipe.transform(employee.name)}`;
    } else {
      title = employee
        ? `Edit employee: ${this.titleCasePipe.transform(employee.name)}`
        : 'Add new employee';
    }

    return [title, mode, disabled];
  }

  getPositionText(position: EmployeePosition): string {
    switch (position) {
      case EmployeePosition.JUNIOR:
        return 'Junior';
      case EmployeePosition.SENIOR:
        return 'Senior';
      case EmployeePosition.OTHER:
        return 'Other';
    }
  }
}
