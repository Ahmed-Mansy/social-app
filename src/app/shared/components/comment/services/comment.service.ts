import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly httpClient = inject(HttpClient)


  createComment(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `comments`, data)
  }

  getPostComments(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/${postId}/comments`)
  }

}
