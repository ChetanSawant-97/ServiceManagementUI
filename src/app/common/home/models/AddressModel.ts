export class Address{
    public firstLine!: string;
    public secondLine!: string;
    public landMark!: string;
    public area!: string;
    public pincode!: string;
    public city!: string;
    public state!: string;

    constructor(init?:Partial<Address>){
        Object.assign(this,init);
    }
}