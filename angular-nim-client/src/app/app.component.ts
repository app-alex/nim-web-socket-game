import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public message = '';
  public $messages!: Observable<string[]>;

  public constructor(private readonly socketService: SocketService) {}

  public ngOnInit(): void {
    this.$messages = this.socketService.getMessage();
  }

  public sendMessage() {
    this.socketService.sendMessage(this.message);
  }
}
