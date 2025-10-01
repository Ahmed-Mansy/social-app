import { Component, input, InputSignal } from '@angular/core';
import { Comment } from '../s-post/models/post.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment',
  imports: [DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

  comment: InputSignal<Comment> = input.required()


}
