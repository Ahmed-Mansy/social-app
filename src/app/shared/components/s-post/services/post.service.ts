import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly httpClient = inject(HttpClient)


  createPost(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts`, data)
  }

  getAllPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts?limit=50`)
  }

  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/${userId}/posts?limit=2`)
  }





}
