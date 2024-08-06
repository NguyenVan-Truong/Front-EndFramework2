export interface User {
	_id?: string | number;
	email: string;
	name: string;
	address: string;
	phone: number;
	password: string;
	avatar: string;
	role: string;
	createdAt: string;
	isLocked?: boolean;
}
