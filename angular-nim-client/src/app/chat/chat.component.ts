import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  public message = '';
  public messages$!: Observable<string[]>;

  public constructor(private readonly socketService: SocketService) {}

  public ngOnInit(): void {
    this.messages$ = this.socketService.getMessage();
  }

  public sendMessage() {
    this.socketService.sendMessage(this.message);
  }
}
