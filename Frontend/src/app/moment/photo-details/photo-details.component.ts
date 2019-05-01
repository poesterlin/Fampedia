import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


interface Comment {
  user: {
    name: string;
    image: string;
  }
  lines: string[];
}

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss']
})
export class PhotoDetailsComponent implements OnInit {
  public imageId?: string;
  public comments: Comment[] = ["Inga Innes", "Cathrine Chism", "Johnnie Jone", "Margarite Mcdavis", "Beryl Bame", "Dahlia Down",
    "Valentina Vandiver", "Su Said", "Darci Desimone", "Meggan Mcpartland"]
    .map((name, id) => {
      return {
        user:
        {
          name,
          image: 'https://randomuser.me/api/portraits/women/' + (id + 1) + '.jpg'
        },
        lines: 'wow looks great |'.repeat(Math.random() * 3 + 1).split('|').filter(s => s.length > 2)
      }
    });

  constructor(private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.imageId = params.id;
    });
  }

}
