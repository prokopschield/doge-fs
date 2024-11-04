export const localStorage =
	"localStorage" in globalThis
		? globalThis.localStorage
		: {
				values: new Map<string, any>(),
				getItem(key: string) {
					return this.values.get(key);
				},
				setItem(key: string, value: any) {
					return this.values.set(key, value);
				},
		  };
