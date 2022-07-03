import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { AppState } from '../_state/app-state.type';
import { selectLlamaByIdParam } from '../_state/llamas/llamas.selectors';
import { Llama } from '../_types/llama.type';
import { llamaPageEnter, saveLlama } from './llama-page.actions';

@UntilDestroy()
@Component({
  selector: 'ld-llama-page',
  templateUrl: './llama-page.component.html',
  styleUrls: ['./llama-page.component.scss'],
})
export class LlamaPageComponent implements OnInit {
  llama: Llama;

  editLlamaForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    imageFileName: new FormControl(''),
  });

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(llamaPageEnter());

    this.store
      .select(selectLlamaByIdParam)
      .pipe(untilDestroyed(this))
      .subscribe((llama) => {
        if (llama) {
          this.llama = llama;
          this.editLlamaForm.patchValue(llama);
        }
      });
  }

  handleSave() {
    const newLlama = { ...this.llama, ...this.editLlamaForm.value };
    this.store.dispatch(saveLlama({ llama: newLlama }));
  }
}
