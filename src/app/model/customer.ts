export class Customer{
    idCustomer: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dni: string;
    address: string;

    // Getter conveniencia para mostrar nombre completo en plantillas
    get name(): string {
        const fn = this.firstName ? this.firstName : '';
        const ln = this.lastName ? this.lastName : '';
        return `${fn}${fn && ln ? ' ' : ''}${ln}`.trim();
    }
}