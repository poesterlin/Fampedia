import { Component } from '@angular/core';
import { NewMomentService } from '../new-moment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fampedia-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent {
  private id = 0
  public showButton = true;
  public loading = false;

  constructor(private service: NewMomentService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => this.id = +params['id']);
    this.service.showButton.subscribe(val => this.showButton = val);
  }

  async add() {
    this.loading = true;
    await this.service.uploadImages(this.id);
    this.loading = false;
    this.router.navigate(['moment/' + this.id]);
  }

}
