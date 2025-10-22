import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectServices {
  
  private url: string = `${environment.HOST}/projects`;
  private projectChange: Subject<Project[]> = new Subject<Project[]>();
  private messageChange: Subject<string> = new Subject<string>();
  
  constructor(private http: HttpClient) {}

  findAll() {
    //lista proyectos
    return this.http.get<Project[]>(this.url);
  }

  findById(id: number) {
    //buscar proyecto por id
    return this.http.get<Project>(`${this.url}/${id}`);
  }

  save(project: Project) {
    //guardar proyecto
    return this.http.post(this.url, project);
  }

  update(id: number, project: Project) {
    //actualizar proyecto
    return this.http.put(`${this.url}/${id}`, project);
  }

  delete(id: number) {
    //eliminar proyecto
    return this.http.delete(`${this.url}/${id}`);
  }

  setProjectChange(data: Project[]) {
    this.projectChange.next(data);
  }

  getProjectChange() {
    return this.projectChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
  
}
