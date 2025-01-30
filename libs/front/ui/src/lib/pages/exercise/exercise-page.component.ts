import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { SocketIoService } from './services/socket-io.service';

@Component({
  selector: 'owl-exercise-page',
  imports: [CommonModule],
  templateUrl: './exercise-page.component.html',
  styleUrl: './exercise-page.component.scss',
})
export class ExercisePageComponent implements OnInit {
  private socket = inject(SocketIoService);

  ngOnInit(): void {
    this.socket.sendEvent('exercise', { id: 1 });
  }
}
