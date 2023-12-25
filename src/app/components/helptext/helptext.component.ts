
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
@Component({
  selector: 'app-helptext',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './helptext.component.html',
  styleUrl: './helptext.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelptextComponent implements OnInit {
  @Input() helpconfig = {CONTRACTCODE:'NONE', KEYCODE:"NOKEY", TITLE:'',QUESTION:'', LINE1:'', LINE2:''} ;
  @Input() EditAllowed = false;
  helper = {CONTRACTCODE:'NONE', KEYCODE:"NOKEY", TITLE:'',QUESTION:'', LINE1:'', LINE2:''} ;
    
  constructor() { }

  ngOnInit(): void {
 if (this.helpconfig.LINE1.length > 5) {
 this.helper = this.helpconfig;
 } else {
  this.helper = {CONTRACTCODE:'NONE', KEYCODE:"NOKEY", TITLE:'',QUESTION:'',
      LINE1: ` <p>Simply fill the <strong>Help Text</strong> as  you would like to display it. <br /> You can use <strong>HTML</strong> tags to format the text. <br /> For example, to make a word <strong>bold</strong>, you would use the <strong>strong</strong> tag.  To make a word <em>italic</em>, you would use the <strong>em</strong> tag.  To make a word <u>underlined</u>, you would use the <strong>u</strong> tag.  To make a word <span style="color: rgb(255, 0, 0);">red</span>, you would use the <strong>span</strong> tag with the <strong>style</strong> attribute.  To make a word <span style="background-color: rgb(255, 255, 0);">yellow</span>, you would use the <strong>span</strong> tag with the <strong>style</strong> attribute.  To make a word <span style="font-size: 24px;">larger</span>, you would use the <strong>span</strong> tag with the <strong>style</strong> attribute.</p>`
    , LINE2:''} ;
 }
  }
}
