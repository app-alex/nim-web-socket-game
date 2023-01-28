import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Message } from 'src/app/shared/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewChecked, OnChanges {
  public message = '';
  public chatHeight = 0;

  @Input() public messages!: Message[] | null;
  @Output() public sendMessage = new EventEmitter<string>();
  @ViewChild('chatMessages') private chatMessagesRef!: ElementRef;

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['messages']?.currentValue?.length > 1 &&
      changes['messages']?.currentValue !== changes['messages']?.previousValue
    ) {
      this.playNotificationSound();
    }
  }

  public ngAfterViewChecked(): void {
    this.scrollChat();
  }

  public onSendMessage() {
    if (this.message) {
      this.sendMessage.emit(this.message);
    }

    this.message = '';
    this.scrollChat();
  }

  private scrollChat() {
    this.chatMessagesRef.nativeElement.scrollTop =
      this.chatMessagesRef.nativeElement.scrollHeight;
  }

  private playNotificationSound() {
    const audio = new Audio('../../../assets/message-notification.mp3');
    audio.load();
    audio.play();
  }
}
