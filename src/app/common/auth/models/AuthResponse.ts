// The classes you defined earlier
export class AuthResponse {
    public success!: boolean;
    public message!: string;
    public data!: AuthResponseData;

    constructor(init?: Partial<AuthResponse>) {
        Object.assign(this, init);
        // Ensure the nested data object is also instantiated as its class
        if (init?.data) {
            this.data = new AuthResponseData(init.data);
        }
    }
}

export class AuthResponseData {
    public token!: string;
    public tokenType!: string;
    public userId!: string;
    public username!: string;
    public role!: 'admin' | 'sales' | 'dealer';
    public dealerId!: string;

    constructor(init?: Partial<AuthResponseData>) {
        Object.assign(this, init);
    }
}