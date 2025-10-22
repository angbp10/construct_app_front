import { ProjectServices} from '../../services/project-services';
import { CustomerService } from '../../services/customer-service';
import { Project } from '../../model/project';
import { Customer } from '../../model/customer';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../material/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',  
  imports: [CommonModule, MaterialModule], // Módulos importados directamente
  templateUrl: './project-component.html',
  styleUrls: ['./project-component.css'],
})
export class ProjectComponent {
  dataSource: MatTableDataSource<Project>;

  // Definición de columnas adaptada para Project
  columnsDefinitions = [
    { def: 'idProject', label: 'ID', hide: false },
    { def: 'name', label: 'Nombre', hide: false },
    { def: 'location', label: 'Ubicación', hide: false },
    { def: 'customer', label: 'Cliente', hide: false }, // Columna para el objeto anidado
    { def: 'startDate', label: 'Fecha Inicio', hide: false },
    { def: 'estimatedEndDate', label: 'Fecha Fin Est.', hide: false },
    { def: 'status', label: 'Estado', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private projectService: ProjectServices, // Inyectamos el nuevo servicio
    private customerService: CustomerService, 
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.projectService.findAll().subscribe(data => this.createTable(data));
    this.projectService.getProjectChange().subscribe(data => this.createTable(data));
    this.projectService.getMessageChange().subscribe( data =>
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      })
    );
  }

  createTable(data: Project[]) {    
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns(): string[] {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }


  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number) {
    
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      this.projectService
        .delete(id)
        .pipe(switchMap(() => this.projectService.findAll()))
        .subscribe((data) => {
          this.projectService.setProjectChange(data);
          this.projectService.setMessageChange('¡PROYECTO ELIMINADO!');
        });
    }
  }
}