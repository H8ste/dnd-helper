import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, NgForm, Validators,  FormBuilder, FormGroup  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { MatFormFieldControl } from "@angular/material/form-field"
import { Spell } from '../home/player_collection';


@Component({
  selector: 'app-create-spell',
  templateUrl: './create-spell.component.html',
  styleUrls: ['./create-spell.component.css']
})
export class CreateSpellComponent implements OnInit {
  form: FormGroup;
  public createdSpell: Spell

  private classes: string
  private materials_needed? : string
  private tags: string


  constructor(fb: FormBuilder, private dialogRef: MatDialogRef<CreateSpellComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    // this.current_hitpoints = data.current_hitpoints;
    // this.max_hitpoints = data.max_hitpoints;
    // this.temp_hitpoints = data.temp_hitpoints;
    this.classes ="";
    this.materials_needed = "";
    this.tags = "";
    this.createdSpell = {
      casting_time: null,
      classes: [],
      components: {
        material: true,
        materials_needed: [],
        raw: null,
        somatic: true,
        verbal: true,
      },
      description: null,
      duration: null,
      higher_levels: null,
      level: null,
      name: null,
      range: null,
      ritual: true,
      school: null,
      tags: [],
      type: null,

    }

    // console.log("oof")
    this.form = fb.group({
      casting_time: [this.createdSpell.casting_time, [Validators.required, Validators.minLength(1)]],
      classes: [this.classes, [Validators.required, Validators.minLength(1)]],
      material: [this.createdSpell.components.material],
      materials_needed: [this.createdSpell.components.materials_needed],
      raw: [this.createdSpell.components.raw, [Validators.required, Validators.minLength(1)]],
      somatic: [this.createdSpell.components.somatic],
      verbal: [this.createdSpell.components.verbal],
      description: [this.createdSpell.description, [Validators.required, Validators.minLength(1)]],
      duration: [this.createdSpell.duration, [Validators.required, Validators.minLength(1)]],
      higher_levels: [this.createdSpell.higher_levels],
      level: [this.createdSpell.level, [Validators.required, Validators.minLength(1)]],
      name: [this.createdSpell.name, [Validators.required, Validators.minLength(1)]],
      range: [this.createdSpell.range, [Validators.required, Validators.minLength(1)]],
      ritual: [this.createdSpell.ritual],
      school: [this.createdSpell.school, [Validators.required, Validators.minLength(1)]],
      tags: [this.tags, [Validators.required, Validators.minLength(1)]],
      type: [this.createdSpell.type, [Validators.required, Validators.minLength(1)]],
    });
    // this.form.updateValueAndValidity();
  }

  ngOnInit(): void {
  }

  save() {
    const { value, valid } = this.form;
  
    if (valid) {
      this.createdSpell = {
        casting_time: value.casting_time,
        classes: value.classes.split(","),
        components: {
          material: value.material,
          materials_needed: value.materials_needed.split(","),
          raw: value.raw,
          somatic: value.somatic,
          verbal: value.verbal,
        },
        description: value.description,
        duration: value.duration,
        higher_levels: value.higher_levels,
        level: value.level,
        name: value.name,
        range: value.range,
        ritual: value.ritual,
        school: value.school,
        tags: value.tags.split(","),
        type: value.type,
  
      }
 
      this.dialogRef.close(this.createdSpell);     
    }
  }

  test(newInput){
    console.log(newInput);
    console.log(this.createdSpell.components.material)
  }

  cancel() {
    this.dialogRef.close();
  }

}
