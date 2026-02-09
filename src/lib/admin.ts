
export const ADMIN_USER_IDS = [
    '658343c0-3ca5-42ac-ba2c-b2ec52d7d2a9', // 上田侑来
];

export function isAdmin(userId?: string | null): boolean {
    if (!userId) return false;
    return ADMIN_USER_IDS.includes(userId);
}
