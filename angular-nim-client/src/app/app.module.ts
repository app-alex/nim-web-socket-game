import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './game/components/chat/chat.component';
import { RoomsComponent } from './rooms/rooms.component';
import { GameComponent } from './game/game.component';

const config: SocketIoConfig = { url: environment.SERVER_URL, options: {} };
@NgModule({
  declarations: [AppComponent, ChatComponent, RoomsComponent, GameComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
