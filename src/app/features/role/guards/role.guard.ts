import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);
  async canActivate(): Promise<boolean> {
    if (!this.roleService.userRole$.getValue()) {
      this.router.navigateByUrl('/role');
      return false;
    }
    return !!this.roleService.userRole$.getValue();
  }
}
