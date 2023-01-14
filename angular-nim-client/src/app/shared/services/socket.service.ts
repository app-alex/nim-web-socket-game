import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEvents } from '../enums/socket-events.enum';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private readonly socket: Socket) {}

  public connect() {
    this.socket.connect();
  }

  public sendMessage(message: string) {
    this.socket.emit(SocketEvents.NEW_MESSAGE, message);
  }

  public getMessage(): Observable<string[]> {
    return this.socket.fromEvent(SocketEvents.MESSAGES);
  }

  public createRoom(roomName: string) {
    this.socket.emit(SocketEvents.CREATE_ROOM, roomName);
  }

  public getRooms(): Observable<string[]> {
    return this.socket.fromEvent(SocketEvents.ROOMS);
  }
}
