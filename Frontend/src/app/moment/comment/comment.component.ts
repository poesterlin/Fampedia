import { Component, OnInit, Input } from '@angular/core';
import { IComment } from 'src/app/core/Interfaces/IComment';


@Component({
  selector: 'fampedia-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() comment!: IComment;
  public fakeImage = Math.floor(Math.random() * 80);


  ngOnInit() {
  }

}
