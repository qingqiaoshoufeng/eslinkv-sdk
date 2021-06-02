/**
 * @description uuid
 */
export function uuid(): string {
	return Math.random().toString(36).replace('0.', '')
}
