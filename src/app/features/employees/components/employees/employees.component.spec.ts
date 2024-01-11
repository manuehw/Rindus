import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { RoleService } from '../../../role/services/role.service';
import { EmployeesService } from '../../services/employees.service';
import { EmployeesComponent } from './employees.component';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let mockRoleService: jasmine.SpyObj<RoleService>;
  let mockEmployeeService: jasmine.SpyObj<EmployeesService>;
  let mockSpinnerService: jasmine.SpyObj<SpinnerService>;

  beforeEach(waitForAsync(() => {
    mockRoleService = jasmine.createSpyObj('RoleService', ['userRole$']);
    mockEmployeeService = jasmine.createSpyObj('EmployeesService', [
      'getEmployees',
      'getEmployeesByWord',
    ]);
    mockSpinnerService = jasmine.createSpyObj('SpinnerService', [
      'show',
      'hide',
    ]);

    TestBed.configureTestingModule({
      imports: [EmployeesComponent, HttpClientModule],
      providers: [
        { provide: RoleService, useValue: mockRoleService },
        { provide: EmployeesService, useValue: mockEmployeeService },
        { provide: SpinnerService, useValue: mockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const mockUserRole$ = jasmine.createSpyObj('Observable', ['subscribe']);
    mockRoleService.userRole$ = mockUserRole$;
    spyOn(component, 'ngOnInit').and.callThrough();

    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should call loadInitialData when ngOnInit is called', () => {
    spyOn(component, 'loadInitialData' as any).and.callThrough();
    const mockUserRole$ = jasmine.createSpyObj('Observable', ['subscribe']);
    mockRoleService.userRole$ = mockUserRole$;
    component.ngOnInit();
    expect((component as any).loadInitialData).toHaveBeenCalled();
  });
});
