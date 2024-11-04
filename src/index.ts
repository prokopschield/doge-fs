import { Future, LazyFuture } from "ps-std";

import { localStorage } from "./storage";

const fs = Future.resolve(import("fs" as any));

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
	}).await(fs);
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
	}).await(fs);
}

export default { read, write };
