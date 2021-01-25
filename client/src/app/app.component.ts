import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Skinet';

  constructor(private basketService: BasketService){

  }
  ngOnInit(): void {
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
