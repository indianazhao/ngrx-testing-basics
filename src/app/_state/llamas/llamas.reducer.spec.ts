import { createAction } from '@ngrx/store';
import { createFakeLlama } from 'src/app/_types/llama.fake';
import { Llama } from 'src/app/_types/llama.type';
import { loadLlamaSuccess, saveLlamaSuccess } from './llamas-api.actions';
import { llamaReducer } from './llamas.reducer';

describe('LlamasReducer', () => {
  let fakeInputAction: any;
  let actualResult: any;

  Given(() => {
    fakeInputAction = undefined;
    actualResult = undefined;
  });

  describe('INIT', () => {
    When(() => {
      actualResult = llamaReducer(undefined, createAction('empty'));
    });

    Then('should return an empty array', () => {
      expect(actualResult).toEqual([]);
    });
  });

  describe('ACTION: loadLlamaSuccess', () => {
    let oldFakeLlamas: Llama[];
    let newFakeLlamas: Llama[];

    Given(() => {
      oldFakeLlamas = [createFakeLlama({ name: 'OLD LLAMA' })];
      newFakeLlamas = [createFakeLlama({ name: 'NEW LLAMA' })];

      fakeInputAction = loadLlamaSuccess({ llamas: newFakeLlamas });
    });

    When(() => {
      actualResult = llamaReducer(oldFakeLlamas, fakeInputAction);
    });

    Then('should return the new llamas', () => {
      // toBe 是比較 reference 是否相同
      expect(actualResult).toBe(newFakeLlamas);
    });
  });

  describe('ACTION: saveLlamaSuccess', () => {
    let fakeOldLlama: Llama;
    let fakeOldLlamas: Llama[];
    let fakeUpdatedLlama: Llama;

    Given(() => {
      fakeOldLlama = createFakeLlama({
        id: 'FAKE_FOUND_ID',
        name: 'FAKE OLD NAME',
      });

      fakeOldLlamas = [createFakeLlama(), fakeOldLlama];

      fakeUpdatedLlama = createFakeLlama({
        id: 'FAKE_FOUND_ID',
        name: 'FAKE UPDATED NAME',
      });

      fakeInputAction = saveLlamaSuccess({ llama: fakeUpdatedLlama });
    });

    When(() => {
      actualResult = llamaReducer(fakeOldLlamas, fakeInputAction);
    });

    Then('return new array and llama with the updated properties', () => {
      // toBe 是比較 reference 是否相同
      expect(actualResult).not.toBe(fakeOldLlamas);
      const actualUpdatedLlama = actualResult[1];
      expect(actualUpdatedLlama).not.toBe(fakeOldLlama);
      expect(actualUpdatedLlama.name).toBe(fakeUpdatedLlama.name);
    });
  });
});
