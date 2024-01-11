import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { Role } from '../../../../data/enums/role.enum';
import { RoleService } from '../../services/role.service';
import { RoleSelectionComponent } from './role-selection.component';

describe('RoleSelectionComponent', () => {
  let component: RoleSelectionComponent;
  let fixture: ComponentFixture<RoleSelectionComponent>;
  let router: jasmine.SpyObj<Router>;
  let roleService: jasmine.SpyObj<RoleService>;

  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const roleServiceSpy = jasmine.createSpyObj('RoleService', ['setRole']);

    TestBed.configureTestingModule({
      imports: [AppComponent, RoleSelectionComponent],
      declarations: [],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RoleService, useValue: roleServiceSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSelectionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set up the roleEnum correctly', () => {
    expect(component.roleEnum).toEqual(Role);
  });

  it('should call RoleService and navigate when selectRole is called', () => {
    const mockRole = Role.ADMIN;

    component.selectRole(mockRole);

    expect(roleService.setRole).toHaveBeenCalledWith(mockRole);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/employees');
  });
});
