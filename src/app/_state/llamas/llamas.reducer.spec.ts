import { createFakeLlama } from 'src/app/_types/llama.fake';
import { Llama } from 'src/app/_types/llama.type';
import { loadLlamaSuccess } from './llamas-api.actions';
import { llamaReducer } from './llamas.reducer';

describe('LlamasReducer', () => {
  let fakeInputAction: any;
  let actualResult: any;

  Given(() => {
    fakeInputAction = undefined;
    actualResult = undefined;
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
      expect(actualResult).toBe(newFakeLlamas);
    });
  });
});
