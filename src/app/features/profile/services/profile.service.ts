import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface UserResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    photo: string;
    createdAt: string;
  };
}

interface PostsResponse {
  message: string;
  posts: Array<{
    _id: string;
    body: string;
    image?: string;
    createdAt: string;
    user: {
      _id: string;
      name: string;
      photo: string;
    };
    comments: any[];
  }>;
}

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  getUserProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(environment.baseUrl + `users/profile-data`);
  }

  getUserPosts(userId: string): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(environment.baseUrl + `users/${userId}/posts?limit=50`);
  }

  updatePhoto(formData: FormData): Observable<UserResponse> {
    return this.http.patch<UserResponse>(environment.baseUrl + `users/upload-photo`, formData);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const body: PasswordChangeRequest = {
      currentPassword,
      newPassword
    };
    return this.http.patch(environment.baseUrl + `users/change-password`, body);
  }
}