import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEvents } from '../enums/socket-events.enum';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private readonly socket: Socket) {}

  public sendMessage(message: string, roomName: string) {
    this.socket.emit(SocketEvents.NEW_MESSAGE, message, roomName);
  }

  public joinRoom(roomName: string) {
    this.socket.emit(SocketEvents.JOIN_ROOM, roomName);
  }

  public leaveRoom(roomName: string) {
    this.socket.emit(SocketEvents.LEAVE_ROOM, roomName);
  }

  public getGame(): Observable<number[]> {
    return this.socket.fromEvent(SocketEvents.GAME);
  }

  public getRooms(): Observable<string[]> {
    return this.socket.fromEvent(SocketEvents.ROOMS);
  }

  public getMessage(): Observable<Message[]> {
    return this.socket.fromEvent(SocketEvents.MESSAGES);
  }
}
