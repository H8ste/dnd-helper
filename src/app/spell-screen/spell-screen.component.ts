import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spell-screen',
  templateUrl: './spell-screen.component.html',
  styleUrls: ['./spell-screen.component.css']
})
export class SpellScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick(): void {
    // console.log("clicked");
    this.router.navigate(["/"]);
  }

}
