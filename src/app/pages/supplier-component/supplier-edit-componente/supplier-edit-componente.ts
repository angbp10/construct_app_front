import {Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierService } from '../../../services/supplier-service';
import { Supplier } from '../../../model/supplier';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-supplier-edit',
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './supplier-edit-componente.html',
  styleUrls: ['./supplier-edit-componente.css']
})
export class SupplierEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

    constructor(
    private route: ActivatedRoute, // Tomar y conocer algo de la url activa
    private supplierService: SupplierService,
    private router: Router // Sirve para navegar a otra ruta
  ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
        idSupplier: new FormControl(),
        name: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
        ruc: new FormControl(''),
        address: new FormControl(''),
    });

    this.route.params.subscribe((data) => {
        this.id = data['id'];
        this.isEdit = data['id'] != null;
        this.initForm();
    });

}

    initForm() {
        if (this.isEdit) {
        this.supplierService.findById(this.id).subscribe((data) => {
            this.form = new FormGroup({
            idSupplier: new FormControl(data.idSupplier),
            name: new FormControl(data.name),
            phone: new FormControl(data.phone),
            email: new FormControl(data.email),
            ruc: new FormControl(data.ruc),
            address: new FormControl(data.address),
            });
        });
    }
}

    operate() {
        const supplier: Supplier = new Supplier();
        supplier.idSupplier = this.form.value['idSupplier'];
        supplier.name = this.form.value['name'];
        supplier.phone = this.form.value['phone'];
        supplier.email = this.form.value['email'];
        supplier.ruc = this.form.value['ruc'];
        supplier.address = this.form.value['address'];

        if (this.isEdit) {
        this.supplierService.update(this.id, supplier).subscribe(() => {
            this.supplierService.findAll().subscribe((data) => {
            this.supplierService.setSupplierChange(data);
            this.supplierService.setMessageChange('UPDATED!');
            });

        });
        } else {
            this.supplierService
            .save(supplier)
            .pipe(switchMap(() => this.supplierService.findAll()))
            .subscribe((data) => {
                this.supplierService.setSupplierChange(data);
                this.supplierService.setMessageChange('SUPPLIER SAVED!');
            });
        }

        this.router.navigate(['/pages/supplier']);
    }

}
