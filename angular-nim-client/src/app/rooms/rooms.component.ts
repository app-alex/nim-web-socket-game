import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  clog(val: any) {
    console.log(val);
  }
  public constructor(private readonly socketService: SocketService) {}

  public roomName!: string;
  public rooms$!: Observable<string[]>;

  public async ngOnInit(): Promise<void> {
    this.socketService.connect();
    this.rooms$ = this.socketService.getRooms();
  }

  public createRoom() {
    this.socketService.createRoom(this.roomName);
  }
}
