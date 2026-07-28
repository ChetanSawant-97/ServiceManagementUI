export class DealerMaster {
    public name: string;
    public branch_code: string;
    public address_id: string;
    public is_deleted: string;
    public is_active: string;
    public mobile_no: string;
    public email_id: string;
    public created_date: string;
    public updated_date: string;
    public created_by: string;
    public updated_by: string;

    constructor(init?: Partial<DealerMaster>) {
        this.name = init?.name ?? '';
        this.branch_code = init?.branch_code ?? '';
        this.address_id = init?.address_id ?? '';
        this.is_deleted = init?.is_deleted ?? '';
        this.is_active = init?.is_active ?? '';
        this.mobile_no = init?.mobile_no ?? '';
        this.email_id = init?.email_id ?? '';
        this.created_date = init?.created_date ?? '';
        this.updated_date = init?.updated_date ?? '';
        this.created_by = init?.created_by ?? '';
        this.updated_by = init?.updated_by ?? '';
    }
}