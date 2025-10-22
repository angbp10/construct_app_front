import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProjectServices } from '../../../services/project-services';
import { CustomerService } from '../../../services/customer-service';
import { Project } from '../../../model/project';
import { Customer } from '../../../model/customer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-edit',
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './project-edit-componente.html',
  styleUrls: ['./project-edit-componente.css'],
})
export class ProjectEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;
  customers: Customer[] = []; // Para la lista desplegable de clientes

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectServices,
    private customerService: CustomerService, // Necesario para obtener la lista de clientes
    private router: Router
  ) {}

  // usado por <mat-select [compareWith]="compareCustomers">
  compareCustomers(a: Customer | null, b: Customer | null): boolean {
    if (a === null && b === null) return true;
    if (!a || !b) return false;
    return a.idCustomer === b.idCustomer;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
        idProject: new FormControl(),
        name: new FormControl('', Validators.required),
        location: new FormControl('', Validators.required),
        startDate: new FormControl('', Validators.required),
        estimatedEndDate: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
        customer: new FormControl(null, Validators.required) // Objeto Customer
    });

    this.customerService.findAll().subscribe(data => {
      console.log('Clientes recibidos:', data);
        this.customers = data;
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
        this.projectService.findById(this.id).subscribe((data) => {
            this.form = new FormGroup({
                idProject: new FormControl(data.idProject),
                name: new FormControl(data.name, Validators.required),
                location: new FormControl(data.location, Validators.required),
                startDate: new FormControl(data.startDate, Validators.required),
                estimatedEndDate: new FormControl(data.estimatedEndDate, Validators.required),
                status: new FormControl(data.status, Validators.required),
                customer: new FormControl(data.customer, Validators.required)
            });
        });
    }
  }

  operate() {
    const project: Project = new Project();
    project.idProject = this.form.value['idProject'];
    project.name = this.form.value['name'];
    project.location = this.form.value['location'];
    project.startDate = this.form.value['startDate'];
    project.estimatedEndDate = this.form.value['estimatedEndDate'];
    project.status = this.form.value['status'];
    project.customer = this.form.value['customer']; // Asignar el objeto Customer seleccionado

    if (this.isEdit) {
      this.projectService.update(this.id, project).subscribe(() => {
        this.projectService.findAll().subscribe((data) => {
          this.projectService.setProjectChange(data);
          this.projectService.setMessageChange('¡PROYECTO MODIFICADO!');
        });
      });
    }else {
        this.projectService
        .save(project)
        .pipe(switchMap(() => this.projectService.findAll()))
        .subscribe((data) => {
          this.projectService.setProjectChange(data);
          this.projectService.setMessageChange('¡PROYECTO REGISTRADO!');
        });
    }

    this.router.navigate(['/pages/project']);
  }
    
}
