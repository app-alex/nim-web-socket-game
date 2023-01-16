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
  public game$!: Observable<number[]>;

  public constructor(
    private readonly socketService: SocketService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.roomName = this.activatedRoute.snapshot.params['room'];
    this.messages$ = this.socketService.getMessage();
    this.game$ = this.socketService.getGame();
  }

  public sendMessage(message: string) {
    this.socketService.sendMessage(message, this.roomName);
  }

  public leaveRoom() {
    this.socketService.leaveRoom(this.roomName);
    this.router.navigate(['rooms']);
  }
}
