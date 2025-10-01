import { Component, ElementRef, inject, OnInit, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { initFlowbite, Modal } from 'flowbite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { PostService } from '../s-post/services/post.service';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit {

  saveFile: WritableSignal<File | null> = signal(null)
  filePreview: WritableSignal<string | null> = signal(null);
  myModal = viewChild<ElementRef>('modal')

  fileInput = viewChild<ElementRef>('fileInput')

  private readonly postService = inject(PostService)

  private modalInstance!: Modal;


  content: FormControl = new FormControl(null, [Validators.required])

  ngOnInit(): void {
    // initFlowbite();




  }

  ngAfterViewInit(): void {
    if (this.myModal()?.nativeElement) {
      this.modalInstance = new Modal(this.myModal()?.nativeElement);
    }
  }
  openModal(): void {
    this.modalInstance.show();
  }

  changeFile(e: Event): void {

    let input = e.target as HTMLInputElement
    if (input.files && input.files.length > 0) {

      const file = input.files[0];
      this.saveFile.set(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.filePreview.set(reader.result as string);
      };



    }
  }


  submitForm(e: Event): void {
    e.preventDefault();
    if (this.content.valid) {
      console.log(this.content.value)
      console.log(this.saveFile())


      const formData = new FormData();
      formData.append('body', this.content.value)

      if (this.saveFile()) {
        formData.append('image', this.saveFile() as File)
      }

      this.postService.createPost(formData).subscribe({
        next: (res) => {

          console.log(res)
          if (res.message === 'success') {
            this.modalInstance.hide();
            this.content.reset();
            this.saveFile.set(null);
            this.filePreview.set(null);
            this.fileInput()!.nativeElement.value = '';
          }

        }
      })


    }
  }

}
