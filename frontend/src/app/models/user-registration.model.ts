export interface UserRegistrationDTO {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    taxId?: string; // CPF
    addresses?: any[];

    // Marketing preferences
    newsletterOptIn?: boolean;
    smsOptIn?: boolean;

    // User preferences
    language?: string;
    currency?: string;
    timezone?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    orderUpdates?: boolean;
    promotionalEmails?: boolean;
    newsletter?: boolean;
}
