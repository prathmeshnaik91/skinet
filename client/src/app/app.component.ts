import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Skinet';

  constructor(private basketService: BasketService, private accountService:AccountService){

  }
  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadCurrentUser(){
    const token=localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe(()=>{
      console.log('User loaded');
    },error=>{
      console.log(error);
    })
  }

  loadBasket(){
    const basketid = localStorage.getItem('basket_id');
    if(basketid){
      this.basketService.getBasket(basketid).subscribe(()=>{
        console.log('Basket Initialized');
      }, error=>{
        console.log(error);
      })
    }
  }
}
