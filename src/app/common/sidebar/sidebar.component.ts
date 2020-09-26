import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('user'));
  constructor(private router: Router ) { }

  ngOnInit() {
  }
  logOut(){
    localStorage.clear();
    this.router.navigate(['/login']);
   }
}
