import { MaterialService } from './../../services/material-service';
import { Material } from './../../model/material';
import { Supplier } from './../../model/supplier';
import { SupplierService } from './../../services/supplier-service';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material/material-module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs'

@Component({
  selector: 'app-material',  
  imports: [CommonModule, MaterialModule, RouterOutlet, RouterLink], // Módulos importados directamente
  templateUrl: './material-componente.html',
  styleUrls: ['./material-componente.css']
})
export class MaterialComponente {
  dataSource: MatTableDataSource<Material>;

    // Definición de columnas adaptada para Material
    columnsDefinitions = [
        { def: 'idMaterial', label: 'ID', hide: false },
        { def: 'name', label: 'Nombre', hide: false },
        { def: 'measurementUnit', label: 'Unidad de Medida', hide: false },
        { def: 'unitPrice', label: 'Precio Unitario', hide: false },
        { def: 'actualStock', label: 'Stock Actual', hide: false },
        { def: 'supplier', label: 'Proveedor', hide: false }, // Columna para el objeto anidado
        { def: 'actions', label: 'Acciones', hide: false },
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private materialService: MaterialService,
        private supplierService: SupplierService,
        private _snackBar: MatSnackBar
    ) {}
      
    ngOnInit(): void {
        this.materialService.findAll().subscribe(data => this.createTable(data));
        this.materialService.getMaterialChange().subscribe(data => this.createTable(data));
        this.materialService.getMessageChange().subscribe( data =>
            this._snackBar.open(data, 'INFO', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            })
        );
    }  

    createTable(data: Material[]) {    
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getDisplayedColumns(): string[] {
        return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
    }

    applyFilter(e: any) {
        this.dataSource.filter = e.target.value.trim();
    }

    delete (id: number) {
        if (confirm('¿Está seguro de eliminar el material?')) {
            this.materialService
            .delete(id)
            .pipe(switchMap(() => this.materialService.findAll()))
            .subscribe(data => {
                this.materialService.setMaterialChange(data);
                this.materialService.setMessageChange('Material eliminado');
            });
        }
    }

}