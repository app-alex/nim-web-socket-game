import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-play-board',
  templateUrl: './play-board.component.html',
  styleUrls: ['./play-board.component.scss'],
})
export class PlayBoardComponent implements OnInit {
  @Input() public game: number[] = [];
  public selectedItems: number[][] = [[]];

  public ngOnInit(): void {
    this.setSelectedItems();
  }

  public onSelectItem(groupIndex: number, itemIndex: number) {
    this.selectedItems[groupIndex][itemIndex] = 1;
  }

  public setSelectedItems() {
    this.game.map((numberOfItems, groupIndex) => {
      for (let itemIndex = 0; itemIndex < numberOfItems; itemIndex++) {
        this.selectedItems[groupIndex][itemIndex] = 0;
      }
    });
  }

  public getIterableArray(number: number) {
    return Array.from(Array(number).keys());
  }
}
