import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advisors',
  templateUrl: './advisors.page.html',
  styleUrls: ['./advisors.page.scss'],
})
export class AdvisorsPage implements OnInit {
  isMember: boolean = false;
  constructor(private route: Router) {}

  ngOnInit() {}

  details() {
    this.route.navigate(['advisor-details']);
  }
}
