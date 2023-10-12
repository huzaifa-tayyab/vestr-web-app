import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-set',
  templateUrl: './theme-set.component.html',
  styleUrls: ['./theme-set.component.scss'],
})
export class ThemeSetComponent implements OnInit {
  darktheme = false;
  constructor() {
  }
  ngOnInit() {
    const theme = localStorage.getItem('user-theme');
    if(theme){
      if(theme==='dark'){
        this.darktheme = true;
        document.body.setAttribute('color-theme', 'dark');
      } else {
        this.darktheme = false;
        document.body.setAttribute('color-theme', 'light');
      }

    } else {
      this.darktheme = false;
      document.body.setAttribute('color-theme', 'light');
    }
  }
  toggle(e){
    if(e==='light'){
      this.darktheme = true;
      document.body.setAttribute('color-theme', 'dark');
      localStorage.setItem('user-theme', 'dark')
    } else {
      this.darktheme = false;
      document.body.setAttribute('color-theme', 'light');
      localStorage.setItem('user-theme', 'light')
    }
  }

}
