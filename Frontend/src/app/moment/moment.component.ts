import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from '../core/Entitys/Moment';
import { MomentService } from './moment.service';
import { environment } from 'src/environments/environment';
import { CoreService, EUpdateType } from '../core/core.service';
import { IComment } from '../core/Interfaces/IComment';
import { LoginService } from '../login/login.service';
import { filter } from 'rxjs/operators';

enum ShowMode {
  PHOTO = 0, COMMENT = 1
}

@Component({
  selector: 'fampedia-event',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.scss']
})
export class MomentComponent implements OnInit {
  public id: number = 0;
  public moment?: Moment;
  public mode: ShowMode = ShowMode.PHOTO;
  public comments: IComment[] = [];
  public commentInput = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MomentService,
    private core: CoreService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = parseInt(params.id);
      this.service.moments$.subscribe(() => {
        this.moment = this.service.getMoment(this.id);
        this.updateComments();
      });
    });

    this.core.updatesAvaliable$.pipe(filter((type) => type === EUpdateType.comment)).subscribe(() => {
      this.updateComments();
    });
  }

  public updateComments() {
    if (this.moment) {
      this.core.getComments(this.moment.momentId).subscribe((comments) => this.comments = comments);
    }
  }

  public update() {
    const t = document.querySelector('#header')!;
    const image = document.querySelector('#image')! as any;
    const top = t.getClientRects()[0].top;
    image.style.height = 250 + top + "px";
    image.style.marginTop = -top + "px";
  }

  get imageUrl() {
    if (this.moment) {
      return `url("${environment.url}/momentimage/getImage/640/${this.moment.images[0]}?token=${this.loginService.user$.getValue()!.token}")`
    }
    return '';
  }

  public showPhotos() {
    this.mode = ShowMode.PHOTO;
  }

  public showComments() {
    this.mode = ShowMode.COMMENT;
  }

  public postComment() {
    if (this.moment) {
      this.core.postComment(this.moment.momentId, this.commentInput).subscribe(() => {
        this.commentInput = "";
        this.updateComments();
      });
    }
  }

  public navigateToHeaderImage() {
    if (this.moment) {
      this.router.navigate(['/moment/image/' + this.moment.images[0]]);
    }
  }
}
