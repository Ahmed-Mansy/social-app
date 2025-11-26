import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { TimelineComponent } from './features/timeline/timeline.component';
import { ProfileComponent } from './features/profile/profile.component';
import { DetailsPostComponent } from './features/details-post/details-post.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'timeline', pathMatch: 'full' },
    {
        path: '', component: MainLayoutComponent, canActivate: [authGuard], children: [
            { path: 'timeline', component: TimelineComponent, title: 'TimeLine Page' },
            { path: 'profile', component: ProfileComponent, title: 'Profile Page' },
            { path: 'details', component: DetailsPostComponent, title: 'Details Page' },
            { path: 'change', component: ChangePasswordComponent, title: 'Change Password Page' },
        ]
    },

    {
        path: '', component: AuthLayoutComponent, children: [
            { path: 'login', component: LoginComponent, title: 'Login Page' },
            { path: 'register', component: RegisterComponent, title: 'register Page' },
        ]
    },
    { path: '**', component: NotFoundComponent, title: 'Not Found Page' }

];
