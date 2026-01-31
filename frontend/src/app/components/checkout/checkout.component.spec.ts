import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../services/cart.service';
import { EcommerceService } from '../../services/ecommerce.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, provideRouter } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartServiceMock: any;
  let cartItemsSubject: BehaviorSubject<any[]>;

  beforeEach(async () => {
    cartItemsSubject = new BehaviorSubject<any[]>([]);
    cartServiceMock = {
      cartItems$: cartItemsSubject.asObservable(),
      updateQuantity: jasmine.createSpy('updateQuantity'),
      removeFromCart: jasmine.createSpy('removeFromCart'),
      addToCart: jasmine.createSpy('addToCart'),
      clearCart: jasmine.createSpy('clearCart')
    };

    const ecommerceServiceMock = {
      getAddressByCep: jasmine.createSpy('getAddressByCep').and.returnValue(of({})),
      checkout: jasmine.createSpy('checkout').and.returnValue(of({ url: 'http://test.com' }))
    };

    const snackBarMock = {
      open: jasmine.createSpy('open').and.returnValue({
        onAction: () => of(null)
      })
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, NoopAnimationsModule],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: EcommerceService, useValue: ecommerceServiceMock },
        provideRouter([]),
        { provide: MatSnackBar, useValue: snackBarMock },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe from cartItems$ on destroy', () => {
    // Initial state
    const item1 = { product: { id: 1, price: 10, name: 'P1' }, quantity: 1 };
    cartItemsSubject.next([item1]);
    expect(component.cartItems.length).toBe(1);
    expect(component.total).toBe(10);

    // Spy on calculateTotals to verify if it's called
    spyOn(component, 'calculateTotals').and.callThrough();

    // Destroy component
    fixture.destroy();

    // Emit new value
    const item2 = { product: { id: 2, price: 20, name: 'P2' }, quantity: 1 };
    cartItemsSubject.next([item2]);

    // Check if calculateTotals was called.
    // If not unsubscribed, the subscription callback runs, calling calculateTotals.
    expect(component.calculateTotals).not.toHaveBeenCalled();
  });
});
