import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit {
  @Output() OnSwitchScreen = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
  switchScreen() {
    this.OnSwitchScreen.emit(0);
  }
}
