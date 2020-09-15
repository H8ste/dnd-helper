import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ability-modifier',
  templateUrl: './ability-modifier.component.html',
  styleUrls: ['./ability-modifier.component.css']
})
export class AbilityModifierComponent implements OnInit {
  @Input() ability: any;
  constructor() {
  }

  ngOnInit(): void {
  }

}
