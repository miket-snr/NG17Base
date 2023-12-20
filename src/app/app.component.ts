import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router'; // Import RouterModule
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MatSidenavModule,MatToolbarModule,MatListModule,MatIconModule,RouterModule,MatSnackBarModule,
  MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit  {
  opened = true;
 
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  constructor(private breakpointObserver: BreakpointObserver, private snackBar: MatSnackBar) {}
  ngOnInit() {
    setTimeout(() => {
      this.opened = false;
    },500)
    this.openSnackBar('           Welcome to Template17');
  }
  openSnackBar(message: string) {
    if (message.includes('Welcome')) {
      let snackbarRef = this.snackBar.open(message, '', { duration: 2000 });
    } else {
    let snackbarRef = this.snackBar.open(message, 'Ignore', { duration: 2000 });
    }
  }
  title = 'Template17';
}
