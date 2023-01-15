import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public messages$!: Observable<string[]>;
  public roomName!: string;

  public constructor(
    private readonly socketService: SocketService,
    private readonly router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.messages$ = this.socketService.getMessage();
    this.roomName = this.activatedRoute.snapshot.params['room'];
    console.log(this.roomName);
  }

  public sendMessage(message: string) {
    console.log(message, this.roomName);

    this.socketService.sendMessage(message, this.roomName);
  }

  public leaveRoom() {
    this.socketService.leaveRoom(this.roomName);
    this.router.navigate(['rooms']);
  }
}
