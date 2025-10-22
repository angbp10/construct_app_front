import { Component } from "@angular/core";
import { MaterialModule } from "../../../material/material-module";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { switchMap } from "rxjs";
import { MaterialService } from "../../../services/material-service";
import { Material } from "../../../model/material";
import { Supplier } from "../../../model/supplier";
import { SupplierService } from "../../../services/supplier-service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-material-edit",
    imports: [MaterialModule, ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: "./material-edit-componente.html",
    styleUrls: ["./material-edit-componente.css"],
})
export class MaterialEditComponent {
    form: FormGroup;
    id: number;
    isEdit: boolean;
    suppliers: Supplier[] = []; // Para la lista desplegable de proveedores

    constructor(
        private route: ActivatedRoute,
        private materialService: MaterialService,
        private supplierService: SupplierService, // Necesario para obtener la lista de proveedores
        private router: Router
    ) {}

    // usado por <mat-select [compareWith]="compareSuppliers">
    compareSuppliers(a: Supplier | null, b: Supplier | null): boolean {
        if (a === null && b === null) return true;
        if (!a || !b) return false;
        return a.idSupplier === b.idSupplier;
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            idMaterial: new FormControl(),
            name: new FormControl("", Validators.required),
            measurementUnit: new FormControl("", Validators.required),
            unitPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
            actualStock: new FormControl(0, [Validators.required, Validators.min(0)]),
            supplier: new FormControl(null, Validators.required) // Objeto Supplier
        });

        this.supplierService.findAll().subscribe(data => {
            console.log('Proveedores recibidos:', data);
            this.suppliers = data;
        });

        this.route.params.subscribe((data) => {
            this.id = data["id"];
            this.isEdit = data["id"] != null;
            this.initForm();
        });

    }

    initForm() {
        if (this.isEdit) {
            this.materialService.findById(this.id).subscribe((data) => {
                this.form = new FormGroup({
                    idMaterial: new FormControl(data.idMaterial),
                    name: new FormControl(data.name, Validators.required),
                    measurementUnit: new FormControl(data.measurementUnit, Validators.required),
                    unitPrice: new FormControl(data.unitPrice, [Validators.required, Validators.min(0)]),
                    actualStock: new FormControl(data.actualStock, [Validators.required, Validators.min(0)]),
                    supplier: new FormControl(data.supplier, Validators.required)
                });
            });
        }
    }

    operate() {
        const material = new Material();
        material.idMaterial = this.form.value["idMaterial"];
        material.name = this.form.value["name"];
        material.measurementUnit = this.form.value["measurementUnit"];
        material.unitPrice = this.form.value["unitPrice"];
        material.actualStock = this.form.value["actualStock"];
        material.supplier = this.form.value["supplier"];
        if (this.isEdit) {
            this.materialService.update(this.id, material).subscribe(() => {
                this.materialService.findAll().subscribe((data) => {
                    this.materialService.setMaterialChange(data);
                    this.materialService.setMessageChange("Material actualizado");
                });
            });
        } else {
            this.materialService
            .save(material)
            .pipe(switchMap(() => this.materialService.findAll()))
            .subscribe((data) => {
                this.materialService.setMaterialChange(data);
                this.materialService.setMessageChange("Material registrado");
            });
        }
        this.router.navigate(["/pages/material"]);
    }
}
