import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GameStatus } from 'src/app/shared/enums/game-status.enum';
import { GameStateUpdate } from 'src/app/shared/models/game-state-update.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Game } from 'src/app/shared/models/game.model';

@Component({
  selector: 'app-play-board',
  templateUrl: './play-board.component.html',
  styleUrls: ['./play-board.component.scss'],
})
export class PlayBoardComponent implements OnInit {
  public gameStatus = GameStatus;
  public gameState: number[][] = [];

  @Input() public game!: Game;
  @Input() public status: string = this.gameStatus.WAITING;

  @Output() public sendGameStateUpdate = new EventEmitter<GameStateUpdate>();

  public constructor(private snackBar: MatSnackBar) {}

  public ngOnInit(): void {
    this.setGameState();
  }

  public onSelectItem(groupIndex: number, itemIndex: number) {
    if (
      this.gameState.some((group, index) =>
        group.some((item) => item && index !== groupIndex)
      )
    ) {
      this.setGameState();
    }

    this.gameState[groupIndex][itemIndex] =
      1 - this.gameState[groupIndex][itemIndex];
  }

  public onTake() {
    const groupIndex = this.gameState.findIndex((group) =>
      group.some((item) => item)
    );

    const itemsAmount = this.gameState[groupIndex].reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );

    this.sendGameStateUpdate.emit({ groupIndex, itemsAmount });
    this.setSelectedItems();
    this.playTakeSound();
  }

  private setGameState() {
    const gameState: number[][] = [];

    this.game.board.map((numberOfItems) => {
      const group: number[] = [];

      for (let itemIndex = 0; itemIndex < numberOfItems; itemIndex++) {
        group.push(0);
      }

      gameState.push(group);
    });

    this.gameState = gameState;
  }

  private setSelectedItems() {
    this.game.board.map((numberOfItems, groupIndex) => {
      for (let itemIndex = 0; itemIndex < numberOfItems; itemIndex++) {
        this.gameState[groupIndex][itemIndex] = 0;
      }
    });
  }

  public getIterableArray(number: number) {
    return Array.from(Array(number).keys());
  }

  public isTakeButtonDisabled(): boolean {
    return !this.gameState
      .reduce(
        (selectedItemsArray, group) => [...selectedItemsArray, ...group],
        []
      )
      .includes(1);
  }

  public getInviteUrl(): string {
    return window.location.href;
  }

  public async onInviteButtonClick() {
    await navigator.clipboard.writeText(this.getInviteUrl());
    this.snackBar.open('Link copied!', 'OK', {
      duration: 3000,
    });
  }

  private playTakeSound() {
    const audio = new Audio('../../../assets/take-sound.wav');
    audio.volume = 0.4;
    audio.load();
    audio.play();
  }
}
