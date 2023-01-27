import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './game/components/chat/chat.component';
import { RoomsComponent } from './rooms/rooms.component';
import { GameComponent } from './game/game.component';
import { PlayBoardComponent } from './game/components/play-board/play-board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const config: SocketIoConfig = {
  url: 'https://nodejs-nim-server-web-socket.adaptable.app',
  options: { transports: ['websocket'], upgrade: false },
};
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    RoomsComponent,
    GameComponent,
    PlayBoardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSnackBarModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
