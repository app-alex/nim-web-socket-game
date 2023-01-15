import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewChecked {
  public message = '';

  @Input() public messages!: string[] | null;
  @Output() public sendMessage = new EventEmitter<string>();
  @ViewChild('chatMessages') private chatMessagesRef!: ElementRef;

  public ngAfterViewChecked(): void {
    this.scrollChat();
  }

  public onSendMessage() {
    this.sendMessage.emit(this.message);
    this.message = '';
    this.scrollChat();
  }

  private scrollChat() {
    this.chatMessagesRef.nativeElement.scrollTop =
      this.chatMessagesRef.nativeElement.scrollHeight;
  }
}
