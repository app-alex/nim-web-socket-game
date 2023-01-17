import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-play-board',
  templateUrl: './play-board.component.html',
  styleUrls: ['./play-board.component.scss'],
})
export class PlayBoardComponent implements OnInit {
  @Input() public game: number[] = [];
  public gameState: number[][] = [];

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
    console.log('take');
  }

  private setGameState() {
    const gameState: number[][] = [];

    this.game.map((numberOfItems) => {
      const group: number[] = [];

      for (let itemIndex = 0; itemIndex < numberOfItems; itemIndex++) {
        group.push(0);
      }

      gameState.push(group);
    });

    this.gameState = gameState;
  }

  private setSelectedItems() {
    this.game.map((numberOfItems, groupIndex) => {
      for (let itemIndex = 0; itemIndex < numberOfItems; itemIndex++) {
        this.gameState[groupIndex][itemIndex] = 0;
      }
    });
  }

  public getIterableArray(number: number) {
    return Array.from(Array(number).keys());
  }
}
