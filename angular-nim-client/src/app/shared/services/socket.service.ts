import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable, tap } from 'rxjs';
import { SocketEvents } from '../enums/socket-events.enum';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private readonly socket: Socket) {}

  public sendMessage(msg: string) {
    this.socket.emit(SocketEvents.GET_MESSAGE, msg);
  }

  public getMessage(): Observable<string[]> {
    return this.socket.fromEvent(SocketEvents.MESSAGE);
  }
}
