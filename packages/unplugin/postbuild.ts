import fg from "fast-glob";
import { promises as fs } from "fs";
import { resolve } from "path";
import { basename } from "path/posix";
import { fileURLToPath } from "url";

async function run() {
	// fix cjs exports
	const files = await fg("*.cjs", {
		ignore: ["chunk-*"],
		absolute: true,
		cwd: resolve(fileURLToPath(import.meta.url), "../dist"),
	});
	for (const file of files) {
		console.log("[postbuild]", basename(file));
		let code = await fs.readFile(file, "utf8");
		code = code.replace("exports.default =", "module.exports =");
		code += "exports.default = module.exports;";
		await fs.writeFile(file, code);
	}
}

run();
