import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../../../data/enums/role.enum';
import { SpinnerLoadComponent } from '../../../../shared/components/spinner-load/spinner-load.component';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [SpinnerLoadComponent],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.scss',
})
export class RoleSelectionComponent {
  private readonly router = inject(Router);
  private readonly role = inject(RoleService);
  readonly roleEnum = Role;

  selectRole(role: Role) {
    this.role.setRole(role);
    this.router.navigateByUrl('/employees');
  }
}
