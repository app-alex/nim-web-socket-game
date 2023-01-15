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

  public requestRooms() {
    this.socket.emit(SocketEvents.REQUEST_ROOMS);
  }

  public sendMessage(message: string, roomName: string) {
    this.socket.emit(SocketEvents.NEW_MESSAGE, message, roomName);
  }

  public joinRoom(roomName: string) {
    return this.socket.emit(SocketEvents.JOIN_ROOM, roomName);
  }

  public leaveRoom(roomName: string) {
    return this.socket.emit(SocketEvents.LEAVE_ROOM, roomName);
  }

  public createRoom(roomName: string) {
    this.socket.emit(SocketEvents.CREATE_ROOM, roomName);
  }

  public requestGameStatus(roomName: string) {
    this.socket.emit(SocketEvents.REQUEST_GAME_STATUS, roomName);
  }

  public getGame(): Observable<number[]> {
    return this.socket.fromEvent(SocketEvents.GET_GAME_STATUS);
  }

  public getRooms(): Observable<string[]> {
    return this.socket.fromEvent(SocketEvents.ROOMS);
  }

  public getMessage(): Observable<string[]> {
    return this.socket.fromEvent(SocketEvents.MESSAGES);
  }
}
