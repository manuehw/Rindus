import { Routes } from '@angular/router';
import { EmployeesComponent } from './features/employees/components/employees/employees.component';
import { RoleSelectionComponent } from './features/role/components/role-selection/role-selection.component';
import { RoleGuard } from './features/role/guards/role.guard';
import { NotFoundComponent } from './layouts/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: RoleSelectionComponent },
  { path: 'role', component: RoleSelectionComponent },
  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [RoleGuard],
  },
  { path: '**', component: NotFoundComponent },
];
