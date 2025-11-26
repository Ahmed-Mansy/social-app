import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink } from "@angular/router";
import { UserService } from '../../../../../features/auth/services/user.service';
import { UserData } from '../../../../models/user-data.interface';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  private readonly userService = inject(UserService)
  private readonly cdr = inject(ChangeDetectorRef);

  userData?: UserData


  ngOnInit(): void {
    initFlowbite();
  }

  ngAfterViewInit(): void {
    this.getUserData()


  }


  getUserData(): void {
    this.userService.getLoggedUserData().subscribe({
      next: (res) => {
        this.userData = res;
        this.cdr.detectChanges();
      }
    })
  }


  signOut(): void {
    this.userService.logOut()
  }

}
