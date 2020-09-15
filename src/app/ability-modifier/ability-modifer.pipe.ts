import { Pipe, PipeTransform } from '@angular/core';
/*
 * Calculates the respective added modifier from score
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | asModifier
 * Example:
 *   {{ 10 | asModifier }}
 *   formats to: 0
*/
@Pipe({ name: 'asModifier' })
export class AsModifierPipe implements PipeTransform {
    transform(value: number): number {
        return Math.floor((value - 10) / 2);
    }
}