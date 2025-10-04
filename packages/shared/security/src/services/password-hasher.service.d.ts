export declare class PasswordHasher {
    private readonly saltRounds;
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
    verify(password: string, hash: string): Promise<boolean>;
}
