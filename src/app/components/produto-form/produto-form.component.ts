import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InsertProductRequestDto, ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../dialog/dialog.component';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss']
})
export class ProdutoFormComponent implements OnInit {
  @Input() isEditMode: boolean | undefined;
  productForm: FormGroup;
  imageFile: File | null = null;
  @Input() produtoEdicao: any;
  originalImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      sku: ['', Validators.required],
      category: ['', Validators.required],
      tags: [''],
      active: [true],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.produtoEdicao) {
      this.populateFormForEdit(this.produtoEdicao.product);
    }
  }

  populateFormForEdit(productData: any): void {
    this.productForm.patchValue({
      name: productData.name,
      price: productData.price,
      quantity: productData.quantity,
      description: productData.description,
      sku: productData.sku,
      category: productData.category,
      tags: productData.tags ? productData.tags.join(',') : '',
      active: productData.active,
    });
    this.originalImageUrl = productData.images?.[0] || null;

    // Fetch original image if in edit mode and no new image is selected
    if (this.originalImageUrl) {
      this.fetchOriginalImage(this.originalImageUrl);
    }
  }

  fetchOriginalImage(url: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const fileName = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
      this.imageFile = new File([blob], fileName, { type: blob.type });
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.imageFile = target.files[0];
    }
  }

  onSubmit() {
    if (this.productForm.invalid || (this.isEditMode && !this.imageFile && !this.produtoEdicao.product.images?.length)) {
      return;
    }

    const productData: InsertProductRequestDto = {
      ...this.productForm.value,
      tags: this.productForm.value.tags ? this.productForm.value.tags.split(',') : []
    };

    if (this.isEditMode && this.produtoEdicao) {
      // Edit mode: Update existing product
      this.productService.updateProductWithImage(this.produtoEdicao.product.id, productData, this.imageFile!)
        .subscribe({
          next: (response) => {
            console.log('Produto atualizado com sucesso:', response);
            this.productForm.reset();
            this.imageFile = null;
            const dialogRef = this.dialog.open(ConfirmDialog, {
              width: '250px',
              data: { message: 'Produto editado com sucesso.' }
            });
            dialogRef.afterClosed().subscribe(() => {
           
            });
          },
          error: (error) => {
            console.error('Erro ao atualizar produto:', error);
          },
        });
    } else {
      // Create mode: Add new product
      this.productService.createProduct(productData, this.imageFile!)
        .subscribe({
          next: (response) => {
            console.log('Produto cadastrado com sucesso:', response);
            this.productForm.reset();
            this.imageFile = null;
          },
          error: (error) => {
            console.error('Erro ao cadastrar produto:', error);
          },
        });
    }
  }
}
