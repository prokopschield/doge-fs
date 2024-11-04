import { Future, LazyFuture, noop } from "ps-std";

import { localStorage } from "./storage";

const fs = new Future<any>((resolve) => {
	return resolve((globalThis as any).require("fs"));
});

const fsr = fs.catch(noop);

export function read(filename: string): Future<string> {
	return new LazyFuture<string>((resolve, reject) => {
		if (fs.rejected) {
			resolve(localStorage.getItem(filename) || "");
		} else {
			fs.value!.readFile(
				filename,
				"utf-8",
				(err: unknown, data: string) => {
					err ? reject(err) : resolve(data);
				}
			);
		}
	}).await(fsr);
}

export function write(filename: string, data: string): Future<void> {
	return new LazyFuture<void>((resolve, reject) => {
		if (fs.rejected) {
			resolve(void localStorage.setItem(filename, String(data)));
		} else {
			fs.value!.writeFile(filename, data, (err: unknown) => {
				err ? reject(err) : resolve();
			});
		}
	}).await(fsr);
}

export default { read, write };
