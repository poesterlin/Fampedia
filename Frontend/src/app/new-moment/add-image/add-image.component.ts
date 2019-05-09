import { Component } from '@angular/core';
import { NewMomentService } from '../new-moment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fampedia-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent {
  private id = 0

  constructor(private service: NewMomentService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.id = +params['id']);
  }

  async add() {
    await this.service.uploadImages(this.id);
    document.location.href = document.location.origin;
  }

}
