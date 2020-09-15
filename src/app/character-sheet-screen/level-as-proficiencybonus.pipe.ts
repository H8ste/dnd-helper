import { Pipe, PipeTransform } from '@angular/core';
/*
 * Calculates the respective proficiency bonus from level
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   level | levelAsProficiencybonus
 * Example:
 *   {{ 10 | levelAsProficiencybonus }}
 *   formats to: 4
*/
@Pipe({ name: 'levelAsProficiencybonus' })
export class LevelAsProficiencybonus implements PipeTransform {
    transform(level: number): number {
        return Math.floor((7 + level) / 4);
    }
}