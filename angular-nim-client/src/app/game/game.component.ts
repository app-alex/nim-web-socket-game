import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GameStatus } from '../shared/enums/game-status.enum';
import { GameStateUpdate } from '../shared/models/game-state-update.model';
import { Game } from '../shared/models/game.model';
import { Message } from '../shared/models/message.model';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  public messages$!: Observable<Message[]>;
  public roomName!: string;
  public game$!: Observable<Game>;
  public status$!: Observable<string>;
  public gameStatus = GameStatus;

  public constructor(
    private readonly socketService: SocketService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.roomName = this.activatedRoute.snapshot.params['room'];
    this.socketService.joinRoom(this.roomName);

    this.messages$ = this.socketService.getMessage();
    this.game$ = this.socketService.getGame();
    this.status$ = this.socketService.getStatus();
  }

  public ngOnDestroy(): void {
    this.socketService.leaveRoom(this.roomName);
  }

  public sendMessage(message: string) {
    this.socketService.sendMessage(message, this.roomName);
  }

  public leaveRoom() {
    this.router.navigate(['rooms']);
  }

  public onGameStateUpdate($event: GameStateUpdate) {
    this.socketService.updateGame(this.roomName, $event);
  }
}
