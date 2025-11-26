import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProfileService } from './services/profile.service';
import { SPostComponent } from '../../shared/components/s-post/s-post.component';
import { Post } from '../../shared/components/s-post/models/post.interface';


interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  createdAt: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SPostComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  posts = signal<Post[]>([]);
  loading = signal(true);
  activeTab = signal<'posts' | 'settings'>('posts');

  passwordForm: FormGroup;
  photoFile = signal<File | null>(null);
  photoPreview = signal<string | null>(null);
  uploadingPhoto = signal(false);
  changingPassword = signal(false);

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (response) => {
        this.user.set(response.user);
        this.loading.set(false);
        // Load posts after user data is loaded
        this.loadUserPosts();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading.set(false);
      }
    });
  }

  loadUserPosts(): void {
    const userId = this.user()?._id;
    if (!userId) return;

    this.profileService.getUserPosts(userId).subscribe({
      next: (response) => {
        // Map posts to ensure they have the id property and match Post interface
        const postsWithId: Post[] = response.posts.map(post => ({
          _id: post._id,
          id: post._id,
          body: post.body,
          image: post.image || '', // Ensure image is always a string
          user: post.user,
          createdAt: post.createdAt,
          comments: post.comments
        }));
        this.posts.set(postsWithId);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.photoFile.set(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPhoto(): void {
    const file = this.photoFile();
    if (!file) return;

    this.uploadingPhoto.set(true);
    const formData = new FormData();
    formData.append('photo', file);

    this.profileService.updatePhoto(formData).subscribe({
      next: (response) => {
        const currentUser = this.user();
        if (currentUser) {
          this.user.set({ ...currentUser, photo: response.user.photo });
        }
        this.photoFile.set(null);
        this.photoPreview.set(null);
        this.uploadingPhoto.set(false);
        alert('Photo updated successfully!');
      },
      error: (error) => {
        console.error('Error uploading photo:', error);
        this.uploadingPhoto.set(false);
        alert('Failed to upload photo');
      }
    });
  }

  cancelPhotoUpload(): void {
    this.photoFile.set(null);
    this.photoPreview.set(null);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.changingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.profileService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.changingPassword.set(false);
        this.passwordForm.reset();
        alert('Password changed successfully!');
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.changingPassword.set(false);
        alert('Failed to change password');
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword');
    const confirmPass = control.get('confirmPassword');

    if (newPass && confirmPass && newPass.value !== confirmPass.value) {
      confirmPass.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  setActiveTab(tab: 'posts' | 'settings'): void {
    this.activeTab.set(tab);
  }
}