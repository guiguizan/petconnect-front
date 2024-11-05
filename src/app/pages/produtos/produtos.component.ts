import { Component, EventEmitter, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ConfirmDialog } from 'src/app/components/dialog/dialog.component';
import { PageProductResponseDto, ProductResponseDto, ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  products: ProductResponseDto[] = [];
  filteredProducts: ProductResponseDto[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  abrirCarrinho: boolean = false;
  produtoSelecionado: ProductResponseDto | null = null;
  pesquisa: string = '';
  selectedBoxType: string | null = null;
  step: number = 1;
  atualizarCarrinho: EventEmitter<void> = new EventEmitter<void>();
  isCadastroProduto: boolean = false;
  

  // Variáveis de paginação
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  produtoEdicao: any;
  permissaoAdmin: boolean = false;
  userLogado: boolean = false;
  isDarkTheme: boolean = false;
  animalType: string = '';

  constructor(
    private meta: Meta,
    private title: Title,
    private productService: ProductService,
    private renderer: Renderer2,
    private dialog: MatDialog
  ) {
    this.title.setTitle('Pet Connect');
    this.meta.addTags([
      { name: 'description', content: 'Explore nossa coleção premium de produtos para pets.' },
      { name: 'keywords', content: 'pets, produtos para pets, premium pets, produtos para cães e gatos' },
      { name: 'author', content: 'Pet Connect' },
      { property: 'og:title', content: 'Pet Connect ' },
      { property: 'og:description', content: 'Explore nossa coleção premium de produtos para pets.' },
      { property: 'og:image', content: 'link-to-your-image.jpg' },
      { property: 'og:url', content: 'https://yourwebsite.com' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Pet Connect' },
      { name: 'twitter:description', content: 'Explore nossa coleção premium de produtos para pets.' },
      { name: 'twitter:image', content: 'link-to-your-image.jpg' }
    ]);
  }

  ngOnInit(): void {
    const permissao = localStorage.getItem('permission');
    this.permissaoAdmin = permissao === 'ADMIN';
    const token = localStorage.getItem('token');
    this.userLogado = token != null;
    this.loadState();
    this.loadProducts();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const theme = this.isDarkTheme ? 'dark-theme' : '';
    document.body.className = theme;
  }

  abrirCadastroProduto(){
    this.isCadastroProduto = !this.isCadastroProduto;
  }

  loadProducts() {
    const query = this.animalType;
  
    this.productService.getAllProducts(this.currentPage, this.pageSize, query).subscribe(
      (data: PageProductResponseDto) => {
        this.products = data.content;
        this.filteredProducts = this.products;
        this.totalPages = data.totalPages;
        this.extractCategories();
      },
      error => {
        console.error('Erro ao buscar produtos:', error);
      }
    );
  }
  

  // Extraindo categorias dos produtos
  extractCategories() {
    const categorySet = new Set<string>();
    this.products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    this.categories = Array.from(categorySet);
  }

  // Navegação de página
  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  saveState() {
    const state = {
      currentPage: this.currentPage,
      selectedCategory: this.selectedCategory,
      abrirCarrinho: this.abrirCarrinho,
      pesquisa: this.pesquisa,
      selectedBoxType: this.selectedBoxType,
      step: this.step
    };
    localStorage.setItem('quoteState', JSON.stringify(state));
  }

  loadState() {
    const state = localStorage.getItem('quoteState');
    if (state) {
      const savedState = JSON.parse(state);
      this.currentPage = savedState.currentPage || 0;
      this.selectedCategory = savedState.selectedCategory;
      this.abrirCarrinho = savedState.abrirCarrinho;
      this.pesquisa = savedState.pesquisa;
      this.selectedBoxType = savedState.selectedBoxType;
      this.step = savedState.step;
    }
  }

  abreCarrinho(event: any) {
    this.abrirCarrinho = true;
    this.saveState();
  }

  onCategoryChange(event: Event) {
    this.filterProducts();
    this.step = 3;
    this.saveState();
  }

  onProdutoSelecionado(event: ProductResponseDto) {
    this.produtoSelecionado = event;
    this.saveState();
  }
  
  onProdutoSelecionadoEdit(event: ProductResponseDto) {

    this.produtoEdicao = event;

    this.saveState();
    this.abrirCadastroProduto()
  }

  onProdutoSelecionadoExcluido(event: any) {
    console.log(event)
    this.produtoEdicao = event;
    console.log(this.produtoEdicao);
    this.saveState();
  
    // Chamar o método deleteProduct do serviço
    this.productService.deleteProduct(event.product.id).subscribe(
      () => {
        console.log('Produto excluído com sucesso');
        
        
    

        const dialogRef = this.dialog.open(ConfirmDialog, {
          width: '250px',
          data: { message: 'Produto excluido com sucesso!' }
        });
        dialogRef.afterClosed().subscribe(() => {
          this.loadProducts();
        });

      },
      error => {
        console.error('Erro ao excluir o produto:', error);
        // Você pode exibir uma mensagem de erro ao usuário aqui
      }
    );
  }
  


  onSearchQueryChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.pesquisa = inputElement.value;
    this.filterProducts();
    this.saveState();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      const matchesSearch = product.name?.toLowerCase().includes(this.pesquisa.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  hasFilteredProducts(): boolean {
    return this.filteredProducts.length > 0;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const button = document.getElementById('back-to-top');
    if (button) {
      if (window.pageYOffset > 300) {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    }
  }

  backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectAnimalType(type: string){
    this.step = 2;
    this.saveState();
    this.selectedBoxType = type;
    this.animalType = type
    this.loadProducts();
    console.log(this.animalType)
  }


  selectBoxType(type: string) {
    this.selectedBoxType = type;
    this.step = 2;
    this.saveState();
  }

  showAlert(message: string) {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      const alertElement = this.renderer.createElement('div');
      this.renderer.addClass(alertElement, 'alert');
      this.renderer.addClass(alertElement, 'alert-warning');
      this.renderer.addClass(alertElement, 'alert-dismissible');
      this.renderer.addClass(alertElement, 'fade');
      this.renderer.addClass(alertElement, 'show');
      alertElement.setAttribute('role', 'alert');
      alertElement.innerText = message;

      const closeButton = this.renderer.createElement('button');
      this.renderer.addClass(closeButton, 'btn-close');
      closeButton.setAttribute('type', 'button');
      closeButton.setAttribute('aria-label', 'Close');
      this.renderer.listen(closeButton, 'click', () => {
        this.renderer.removeChild(alertContainer, alertElement);
      });

      this.renderer.appendChild(alertElement, closeButton);
      this.renderer.appendChild(alertContainer, alertElement);

      setTimeout(() => {
        if (alertElement) {
          this.renderer.removeChild(alertContainer, alertElement);
        }
      }, 3000);
    }
  }

  zerarCarrinho() {
    sessionStorage.removeItem('carrinhoProdutos');
    this.atualizarCarrinho.emit();
  }
}