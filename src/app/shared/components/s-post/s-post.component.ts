import { Component, input, InputSignal, OnInit } from '@angular/core';
import { initDropdowns, } from 'flowbite';
import { Post } from './models/post.interface';
import { DatePipe } from '@angular/common';
import { CommentComponent } from "../comment/comment.component";

@Component({
  selector: 'app-s-post',
  imports: [DatePipe, CommentComponent],
  templateUrl: './s-post.component.html',
  styleUrl: './s-post.component.css'
})
export class SPostComponent implements OnInit {

  post: InputSignal<Post> = input.required()


  ngOnInit(): void {
    initDropdowns();
  }


}
