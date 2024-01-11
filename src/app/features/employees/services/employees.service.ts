import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, forkJoin, of, switchMap } from 'rxjs';
import { Employee } from '../../../data/models/employee.model';

@Injectable()
export class EmployeesService {
  private readonly apiUrl = 'http://localhost:3000';

  private readonly http = inject(HttpClient);

  // Since this app utilizes the json-server library to simulate a backend server and lacks the 'or'
  // operator to search by both name and username, we need to make two separate calls to these fields.
  // To achieve this, we use the forkJoin function to send parallel requests and combine the results
  // using the switchMap operator
  getEmployeesByWord(word: string): Observable<Employee[]> {
    const requestByName = this.http.get<Employee[]>(
      `${this.apiUrl}/employees?name_like=${word}`
    );
    const requestBySurname = this.http.get<Employee[]>(
      `${this.apiUrl}/employees?surname_like=${word}`
    );

    return forkJoin([requestByName, requestBySurname]).pipe(
      switchMap((requests) => of([...requests[0], ...requests[1]]))
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  saveEmployee(employee: Employee): Observable<Employee> {
    return this.http
      .post<Employee>(`${this.apiUrl}/employees`, employee)
      .pipe(delay(300));
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http
      .put<Employee>(`${this.apiUrl}/employees/${employee.id}`, employee)
      .pipe(delay(300));
  }
}
