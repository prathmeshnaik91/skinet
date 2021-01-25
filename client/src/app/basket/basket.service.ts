import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { BehaviorSubject } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';
import { ProductDetailsComponent } from '../shop/product-details/product-details.component';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id:string){
    return this.http.get(this.baseUrl+ 'basket?id=' + id)
    .pipe(map((basket: IBasket)=>{
      this.basketSource.next(basket);
      this.calculateTotals();
    })
    );
  }

  setBasket(basket: IBasket){
    return this.http.post(this.baseUrl+'basket',basket).subscribe((response: IBasket)=>{      
      this.basketSource.next(response);
      this.calculateTotals();
    }, error=>{
      console.log(error);
    });
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity =1){
    const itemsToAdd : IBasketItem = this.mapProductItemToBasketItem(item,quantity);
    const basket = this.basketSource.value ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items,itemsToAdd,quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem){
    const basket=this.getCurrentBasketValue();
    const findIndex= basket.items.findIndex(i=>i.id === item.id);
    basket.items[findIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem){
    const basket=this.getCurrentBasketValue();
    const findIndex= basket.items.findIndex(i=>i.id === item.id);
    if(basket.items[findIndex].quantity > 1){
      basket.items[findIndex].quantity--;
      this.setBasket(basket);
    }else{
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
   const basket= this.getCurrentBasketValue();
   if(basket.items.some(x=>x.id === item.id)) {
     basket.items=basket.items.filter(i=>i.id !== item.id);
     if(basket.items.length > 0){
       this.setBasket(basket);
     }else{
       this.deleteBasket(basket);
     }
   }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl+'basket?id='+basket.id).subscribe(()=>{
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id'); 
    },error=>{
      console.log(error);
    })
  }

  createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id',basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): any {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }

  private calculateTotals(){
    const basket=this.getCurrentBasketValue();
    const shipping=0;
    const subtotal = basket.items.reduce((a,b)=> (b.price * b.quantity) + a,0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping,total,subtotal});
  }

  private addOrUpdateItem(items: IBasketItem[], itemsToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index=items.findIndex(i => i.id === itemsToAdd.id);
    if(index === -1 ){
      itemsToAdd.quantity = quantity;
      items.push(itemsToAdd);
    }else{
      items[index].quantity += quantity;
    }
    return items;
  }
}
