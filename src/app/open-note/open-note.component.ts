import { Component, OnInit } from '@angular/core';
import { SharedService } from './../shared.service';

@Component({
  selector: 'app-open-note',
  templateUrl: './open-note.component.html',
  styleUrls: ['./open-note.component.scss']
})
export class OpenNoteComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  close()
  {
    this.sharedService.sendClickEvent("close");
  }

  incrementLikeCount()
  {
    this.sharedService.sendClickEvent("incrementLikeCount");
  }

  deleteNote()
  {
    this.sharedService.sendClickEvent("deleteNote");
  }

}
