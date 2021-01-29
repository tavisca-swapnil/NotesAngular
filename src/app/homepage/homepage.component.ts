import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { SharedService } from './../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomepageComponent implements OnInit {
  clickEventSubscription : Subscription;

  constructor(private sharedService: SharedService) {
    this.clickEventSubscription = this.sharedService.getClickEvent().subscribe( () => {
      if(this.sharedService.functionToBeCalled == "close")
        this.closeNote();
      else if(this.sharedService.functionToBeCalled == "incrementLikeCount")
        this.incrementLikeCount();
      else if(this.sharedService.functionToBeCalled == "deleteNote")
        this.deleteNote();
    });
   }

  leftNotesCount = 0;
  midNotesCount = 0;
  rightNotesCount = 0;
  openNoteId = "";
  notes  = [];

  ngOnInit(): void {
    let filter = document.getElementById("filter");
    filter.addEventListener('input', (event) => {
      this.filter(event)
    });

    let sectionSelect = document.getElementById("sections");
    sectionSelect.addEventListener('change', (event) => {
      this.selectSection(event)
    });

    let sortSelect = document.getElementById("sort");
    sortSelect.addEventListener('change', (event) => {
      this.sort()
    });
  }

  addNote(position)
    {
        let lastNoteLeft = document.getElementById("leftSection").lastElementChild;
        let lastNoteMid = document.getElementById("midSection").lastElementChild;
        let lastNoteRight = document.getElementById("rightSection").lastElementChild;

        if(lastNoteLeft!= null && (<HTMLInputElement>lastNoteLeft.firstChild).innerHTML=="")
        {
            document.getElementById(lastNoteLeft.id).remove();
            this.leftNotesCount--;
        }

        if(lastNoteMid != null && (<HTMLInputElement>lastNoteMid.firstChild).innerHTML=="")
        {
            document.getElementById(lastNoteMid.id).remove();
            this.midNotesCount--;
        }

        if(lastNoteRight != null && (<HTMLInputElement>lastNoteRight.firstChild).innerHTML=="")
        {
            document.getElementById(lastNoteRight.id).remove();
            this.rightNotesCount--;
        }

        let section = position + "Section";
        let lastNote = document.getElementById(section).lastElementChild;

        if(lastNote == null || (<HTMLInputElement>lastNote.firstChild).innerHTML!="")
        {
            let count = 0;
            if(position == "left")
            {
              this.leftNotesCount++;
              count = this.leftNotesCount;
            }
            else if(position == "mid")
            {
              this.midNotesCount++;
              count = this.midNotesCount;
            }
            else
            {
              this.rightNotesCount++;
              count = this.rightNotesCount;
            }

            let note = document.createElement("DIV");
            note.className += "note-item ";
            note.className += position;
            note.id = position + "_" + count;

            let content = document.createElement("P");
            content.className += "note";

            let likes = document.createElement("P");
            likes.className += "likesCounter ";
            likes.innerText = "+0";

            note.appendChild(content);
            note.appendChild(likes);

            note.addEventListener('click', (event) => {
              this.openNote(event, position + "OpenNote")
            });

            document.getElementById(section).appendChild(note);
        }
    }

    openNote(event, id)
    {
      let note = document.getElementById("openNote");
      let blur = document.getElementById("blur");

      note.style.display = "block";
      blur.style.display = "block";

      note.className += id + " ";
      this.openNoteId = event.target.id;

      let openNoteObject = this.notes.find(x => x.id == this.openNoteId);
      if(openNoteObject == undefined)
      {
          let newNote = {
              id : this.openNoteId,
              likes : 0,
              content : "",
              section : id
          }
          openNoteObject = newNote;
          this.notes.push(newNote);
      }
      let contentArea = document.getElementById("openNoteContent");
      (<HTMLInputElement>contentArea).value = openNoteObject.content;
      contentArea.autofocus = true;

      let openLike = document.getElementById("openNoteLike");
      openLike.innerText = "+" + openNoteObject.likes;
    }

    public closeNote()
    {
        let note = document.getElementById("openNote");
        let blur = document.getElementById("blur");

        note.style.display = "none";
        blur.style.display = "none";

        note.className = "";

        let openNoteContentObject = this.notes.find(x => x.id == this.openNoteId);
        let contentArea = document.getElementById("openNoteContent");
        openNoteContentObject.content = (<HTMLInputElement>contentArea).value;

        let openNote = document.getElementById(this.openNoteId);
        (<HTMLInputElement>openNote.firstElementChild).innerText = (<HTMLInputElement>contentArea).value;
        (<HTMLInputElement>openNote.lastElementChild).innerText = "+" + openNoteContentObject.likes;
    }

    incrementLikeCount()
    {
        let openNoteContentObject = this.notes.find(x => x.id == this.openNoteId);
        openNoteContentObject.likes++;

        let openLike = document.getElementById("openNoteLike");
        openLike.innerText = "+" + openNoteContentObject.likes;

        let openNote = document.getElementById(this.openNoteId);
        (<HTMLInputElement>openNote.lastElementChild).innerText = "+" + openNoteContentObject.likes;

        this.sort();
    }

    deleteNote()
    {
        this.notes = this.notes.filter(note => note.id != this.openNoteId);
        document.getElementById(this.openNoteId).remove();

        let note = document.getElementById("openNote");
        let blur = document.getElementById("blur");

        note.style.display = "none";
        blur.style.display = "none";

        note.className = "";
    }

    filter(event)
    {
        let input = event.target.value;
        let allNotes = document.getElementsByClassName("note");

        Array.from(allNotes).forEach(element => {
            if(!(<HTMLInputElement>element).innerText.includes(input))
            {
                element.parentElement.style.display = "none";
            }
            else
            {
              element.parentElement.style.display = "block";
            }
            if(input == "")
            {
                element.parentElement.style.display = "block";
            }
        });
    }

    selectSection(event)
    {
        let input = event.target.value;
        let left = document.getElementById("leftSection");
        let mid = document.getElementById("midSection");
        let right = document.getElementById("rightSection");

        if(input == "1")
        {
            left.style.display = "";
            mid.style.display = "none";
            right.style.display = "none";
        }
        else if(input == "2")
        {
            left.style.display = "none";
            mid.style.display = "";
            right.style.display = "none";
        }
        else if(input == "3")
        {
            left.style.display = "none";
            mid.style.display = "none";
            right.style.display = "";
        }
        else
        {
            left.style.display = "";
            mid.style.display = "";
            right.style.display = "";
        }
    }

    sort()
    {
        let sort = (<HTMLInputElement>document.getElementById("sort")).value;

        if(sort == "1")
        {
          this.setSortedNotes(this.notes);
        }
        else if(sort == "2")
        {
            let noteObjects = this.notes.slice();
            noteObjects.sort(function(a, b) {
                return b.likes - a.likes;
            });

            this.setSortedNotes(noteObjects);
        }
    }

    setSortedNotes(allNotes)
    {
        let leftsection = [];
        let midSection = [];
        let rightSection = [];

        Array.from(allNotes).forEach(element => {
            let note = document.getElementById(element["id"]);

            if(element["section"] == "leftOpenNote")
            {
                leftsection.push(note);
            }
            else if(element["section"] == "midOpenNote")
            {
                midSection.push(note);
            }
            else if(element["section"] == "rightOpenNote")
            {
                rightSection.push(note);
            }
        });

        let leftSide = document.getElementById("leftSection");
        leftSide.innerHTML = "";
        let rightSide = document.getElementById("rightSection");
        rightSide.innerHTML = "";
        let midSide = document.getElementById("midSection");
        midSide.innerHTML = "";

        Array.from(leftsection).forEach(item => {
            leftSide.appendChild(item);
        });

        Array.from(midSection).forEach(item => {
            midSide.appendChild(item);
        });

        Array.from(rightSection).forEach(item => {
            rightSide.appendChild(item);
        });
    }
}


interface ICustomer {
  id: number;
  section: string;
}
