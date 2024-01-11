import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Employee } from '../../../data/models/employee.model';
import { EmployeesService } from './employees.service';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employee: Employee;
  let apiUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeesService],
    });
    service = TestBed.inject(EmployeesService);
    employee = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      birthDate: new Date(),
      position: 1,
    };
    apiUrl = 'http://localhost:3000';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get employees by word', () => {
    const word = 'John';
    const httpSpy = spyOn(service['http'], 'get');

    httpSpy
      .withArgs(`${apiUrl}/employees?name_like=${word}`)
      .and.returnValue(of([employee]));
    httpSpy
      .withArgs(`${apiUrl}/employees?surname_like=${word}`)
      .and.returnValue(of([]));

    service.getEmployeesByWord(word).subscribe((result: Employee[]) => {
      expect(result).toEqual([employee]);
      expect(service['http'].get).toHaveBeenCalledWith(
        `${service['apiUrl']}/employees?name_like=${word}`
      );
      expect(service['http'].get).toHaveBeenCalledWith(
        `${service['apiUrl']}/employees?surname_like=${word}`
      );
    });
  });

  it('should get employees', () => {
    spyOn(service['http'], 'get').and.returnValue(of([employee]));

    service.getEmployees().subscribe((result: Employee[]) => {
      expect(result).toEqual([employee]);
    });
    expect(service['http'].get).toHaveBeenCalledWith(
      `${service['apiUrl']}/employees`
    );
  });

  it('should save employee', () => {
    const httpSpy = spyOn(service['http'], 'post');
    httpSpy
      .withArgs(`${apiUrl}/employees`, employee)
      .and.returnValue(of(employee));

    service.saveEmployee(employee).subscribe((result: Employee) => {
      expect(result).toEqual(employee);
    });
    expect(service['http'].post).toHaveBeenCalledWith(
      `${service['apiUrl']}/employees`,
      employee
    );
  });

  it('should update employee', () => {
    spyOn(service['http'], 'put').and.returnValue(of(employee));

    service.updateEmployee(employee).subscribe((result: Employee) => {
      expect(result).toEqual(employee);
    });
    expect(service['http'].put).toHaveBeenCalledWith(
      `${service['apiUrl']}/employees/${employee.id}`,
      employee
    );
  });
});
