export class DealerMaster {
    public name!: string;
    public branch_code!: string;
    public address_id!: string;
    public is_deleted!: boolean;
    public is_active!: boolean;
    public mobile_no!: string;
    public email_id!: string;
    public created_date!: string;
    public updated_date!: string;
    public created_by!: string;
    public updated_by!: string;

    constructor(init?: Partial<DealerMaster>) {
        Object.assign(this,init);
    }
}