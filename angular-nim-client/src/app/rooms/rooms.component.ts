import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  public constructor(
    private readonly socketService: SocketService,
    private readonly router: Router
  ) {}

  public roomName!: string;
  public rooms$!: Observable<string[]>;

  public async ngOnInit(): Promise<void> {
    this.rooms$ = this.socketService.getRooms();
  }

  public createRoom() {
    this.router.navigate(['game/' + this.roomName]);
  }

  public joinRoom(roomName: string) {
    this.router.navigate(['game/' + roomName]);
  }
}
