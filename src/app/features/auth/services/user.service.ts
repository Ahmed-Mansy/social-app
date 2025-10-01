import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly httpClient = inject(HttpClient)


  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `users/signup`, data)
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `users/signin`, data)
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `users/change-password`, data)
  }

  uploadProfilePhoto(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `users/upload-photo`, data)
  }

  getLoggedUserData(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/profile-data`)
  }


}
