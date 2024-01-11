import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role } from '../../../data/enums/role.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  userRole$ = new BehaviorSubject<Role | undefined>(undefined);

  setRole(role: Role) {
    this.userRole$.next(role);
  }
}
