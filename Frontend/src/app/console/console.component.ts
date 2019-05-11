import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
  public logs: { message: string, date: string }[] = [];

  constructor(private socket: Socket) {
    this.socket.on('log', (log: string) => {
      this.logs.push(JSON.parse(log) as { message: string, date: string });
    });
  }

  ngOnInit() {
  }

}
