import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-hitpoints',
  templateUrl: './dialog-hitpoints.component.html',
  styleUrls: ['./dialog-hitpoints.component.css']
})
export class DialogHitpointsComponent implements OnInit {
  public current_hitpoints: number
  public max_hitpoints: number
  public temp_hitpoints: number

  public overrideTempHitpoints: boolean = false;
  public change: number = 0;

  public result_current_hitpoints: number
  public result_max_hitpoints: number
  public result_temp_hitpoints: number


  constructor(private dialogRef: MatDialogRef<DialogHitpointsComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.current_hitpoints = data.current_hitpoints;
    this.max_hitpoints = data.max_hitpoints;
    this.temp_hitpoints = data.temp_hitpoints;
  }

  inputChanged(newInput: number) {
    console.debug(newInput);
    this.change = newInput;
    this.calculateResultingHitpoints();
  }
  plus(numberOne: number, numberTwo: number) {
    var result = Number(numberOne) + Number(numberTwo);
    console.debug(result);
    return result;
  }

  calculateResultingHitpoints() {
    console.debug(this.overrideTempHitpoints)
    this.result_max_hitpoints = this.max_hitpoints;
    this.result_current_hitpoints = this.current_hitpoints;
    this.result_temp_hitpoints = this.temp_hitpoints;
    if (this.overrideTempHitpoints) {
      this.result_temp_hitpoints = Math.abs(this.change);
      this.result_max_hitpoints = this.max_hitpoints;
      this.result_current_hitpoints = this.current_hitpoints;
    } else {
      if (Number(this.change) > 0) {
        this.result_current_hitpoints = this.clamp(this.plus(this.current_hitpoints, this.change), 0, this.max_hitpoints)
      } else {
        if ((Number(this.temp_hitpoints) + Number(this.change)) < 0) {
          var remainder = Number(this.temp_hitpoints) + Number(this.change);
          this.result_temp_hitpoints = 0;
          this.result_current_hitpoints = this.clamp(Number(this.current_hitpoints) + Number(remainder), 0, this.max_hitpoints);
        } else {
          this.result_temp_hitpoints = Number(this.temp_hitpoints) + Number(this.change);
        }
      }
    }

  }

  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  ngOnInit(): void {
  }

  save() {
    let result = {
      current_hitpoints: this.result_current_hitpoints,
      max_hitpoints: this.result_max_hitpoints,
      temp_hitpoints: this.result_temp_hitpoints,
    }
    this.dialogRef.close(result);
  }

  close() {
    this.dialogRef.close();
  }

}
