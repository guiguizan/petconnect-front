import { Component, OnInit, Input, HostListener, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  isCartOpen = false;
  cartIsEmpty = true;
  @Input() abrirCarrinho: boolean | undefined;
  @Input() produtoSelecionado: any;
  @Input() atualizarCarrinho: EventEmitter<void> = new EventEmitter();
  produtos: any[] = []; // Array para armazenar os produtos
  startX: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.atualizarCarrinho.subscribe(() => this.carregarProdutos());
    if (this.abrirCarrinho !== undefined) {
      this.isCartOpen = this.abrirCarrinho;
    }
    this.carregarProdutos();
   
  }

  carregarProdutos(){
    // Carregar produtos do sessionStorage
    const storedProducts = sessionStorage.getItem('carrinhoProdutos');
    if (storedProducts) {
      this.produtos = JSON.parse(storedProducts);
      this.cartIsEmpty = this.produtos.length === 0;
    }else{
      this.produtos = []
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['produtoSelecionado'] && changes['produtoSelecionado'].currentValue) {
      console.log(changes['produtoSelecionado'].currentValue);
      this.addProduto(changes['produtoSelecionado'].currentValue);
    }
    if (changes['abrirCarrinho']) {
      this.carregarProdutos();
      this.toggleCart();
    }
    
  }

  toggleCart(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.isCartOpen = !this.isCartOpen;
  }

  addProduto(produto: any): void {
    const existingProduct = this.produtos.find(p => p.product === produto.product && p.model === produto.model);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.produtos.push({ ...produto, quantity: 1 });
    }
    console.log(this.produtos);
    this.cartIsEmpty = this.produtos.length === 0;
    this.updateSessionStorage(); // Atualiza o sessionStorage
  }

  updateSessionStorage(): void {
    sessionStorage.setItem('carrinhoProdutos', JSON.stringify(this.produtos));
  }

  removeProduto(produto: any): void {
    this.produtos = this.produtos.filter(p => p !== produto);
    this.cartIsEmpty = this.produtos.length === 0;
    this.updateSessionStorage(); // Atualiza o sessionStorage
    // Garantir que o carrinho permanece aberto
    this.isCartOpen = true;
  }



  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const cartContainer = document.querySelector('.cart-container');
    if (cartContainer && !cartContainer.contains(event.target as Node) && this.isCartOpen) {
      // this.toggleCart();
    }
  }

  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.startX = touch.clientX;
  }

  finalizar() {
    this.router.navigate(['/checkout']);
  }

  onTouchMove(event: TouchEvent) {
    // Implementação opcional para feedback visual durante o deslize
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.startX) return;

    const touch = event.changedTouches[0];
    const endX = touch.clientX;

    if (this.startX - endX > 50) {
      this.toggleCart();
    }

    this.startX = null;
  }

  updateQuantity(produto: any, quantidade: number): void {
    const product = this.produtos.find(p => p === produto);
    if (product) {
      product.quantity = quantidade > 0 ? quantidade : 1;
      if (product.quantity <= 0) {
        this.removeProduto(produto);
      }
      this.updateSessionStorage(); // Update the sessionStorage
    }
  }
  

  getItemTotal(produto: any): number {
    return produto.product.price * produto.quantity;
  }
  

  getTotal(): number {
    return this.produtos.reduce((acc, produto) => acc + produto.product.price * produto.quantity, 0);
  }
  
}
