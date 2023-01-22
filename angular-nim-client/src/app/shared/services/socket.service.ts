import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEvents } from '../enums/socket-events.enum';
import { GameStateUpdate } from '../models/game-state-update.model';
import { Game } from '../models/game.model';
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

  public updateGame(roomName: string, gameStateUpdate: GameStateUpdate) {
    this.socket.emit(SocketEvents.UPDATE_GAME, gameStateUpdate, roomName);
  }

  public getGame(): Observable<Game> {
    return this.socket.fromEvent(SocketEvents.GAME);
  }

  public getRooms(): Observable<string[]> {
    return this.socket.fromEvent(SocketEvents.ROOMS);
  }

  public getMessage(): Observable<Message[]> {
    return this.socket.fromEvent(SocketEvents.MESSAGES);
  }

  public getStatus(): Observable<string> {
    return this.socket.fromEvent(SocketEvents.STATUS);
  }
}
