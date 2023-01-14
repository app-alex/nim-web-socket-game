import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  public message = '';

  @Input() public messages!: string[] | null;
  @Output() public sendMessage = new EventEmitter<string>();

  public onSendMessage() {
    this.sendMessage.emit(this.message);
    this.message = '';
  }
}
