import { EmployeePosition } from '../enums/employee-position.enum';

export interface Employee {
  id: number;
  name: string;
  surname: string;
  birthDate: Date;
  position: EmployeePosition;
  positionDescription?: string;
}
