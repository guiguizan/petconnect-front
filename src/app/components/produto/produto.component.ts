import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {
  @Input() product: any;
  

  private _isPlywood: any;
  permissaoAdmin: boolean = false;
  userLogado: boolean = false;
  @Input() set isPlywood(value: boolean) {
    this._isPlywood = value;
    this.calculateTotalPrice();
  }
  get isPlywood(): boolean {
    return this._isPlywood;
  }

  private _category: any;
  @Input() set category(value: string) {
    this._category = value;
    this.categoryValue = parseInt(value, 10);
    this.calculateTotalPrice();
  }
  get category(): string {
    return this._category;
  }

  @Output() abriuCarrinho: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() produtoSelecionado: EventEmitter<any> = new EventEmitter<any>();
  @Output() editProdutoSelecionado: EventEmitter<any> = new EventEmitter<any>();

  private categoryValue: number = 1;
  produtoAdicionado: boolean = false;
  selectedModel: string = 'Select SKU';
  selectedPrice: number | null = null;
  totalPrice: number | null = null;
  isModalOpen: boolean = false;
  modalImage: string = '';
  showErrorMessage: boolean = false;
  isAddToCartDisabled: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.onModelChange();
    console.log(this.product)
    const permissao = localStorage.getItem('permission');

    this.permissaoAdmin = permissao === 'ADMIN';

  }

  ngOnChanges() {
    this.onModelChange();
  }

  onModelChange() {
    if (this.selectedModel !== 'Select SKU') {
      this.selectedPrice = this.product.prices[this.selectedModel] || null;
      this.calculateTotalPrice();
      this.isAddToCartDisabled = false;
      this.showErrorMessage = false;
    } else {
      this.selectedPrice = null;
      this.totalPrice = null;
      this.isAddToCartDisabled = true;
    }
  }

  calculateTotalPrice() {
    if (this.selectedPrice !== null) {
      let multiplier = 1;
      if (this.isPlywood) {
        switch (this.categoryValue) {
          case 3: multiplier = 0.50; break; // Domu
          case 1: multiplier = 0.55; break; // Plus
          case 2: multiplier = 0.64; break; // Premium
          case 4: multiplier = 0.7; break; // High End
        }
      } else {
        switch (this.categoryValue) {
          case 3: multiplier = 0.45; break; // Domu
          case 1: multiplier = 0.49; break; // Plus
          case 2: multiplier = 0.54; break; // Premium
          case 4: multiplier = 0.60; break; // High End
        }
      }
      this.totalPrice = this.selectedPrice * multiplier;
    }
  }

  editarProduto() {
    this.editProdutoSelecionado.emit({
      product: this.product,
      model: this.selectedModel,
      totalPrice: this.totalPrice
    });

  }

  adicionarProduto() {

    this.produtoAdicionado = true;
    this.abriuCarrinho.emit(true);
    this.produtoSelecionado.emit({
      product: this.product,
      model: this.selectedModel,
      totalPrice: this.totalPrice
    });

    // Esconder a mensagem de sucesso após 3 segundos
    setTimeout(() => {
      this.produtoAdicionado = false;
    }, 3000);
  }

  openModal(imageSrc: string) {
    this.modalImage = imageSrc;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
