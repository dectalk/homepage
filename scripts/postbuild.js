import * as fs from "node:fs/promises";
import * as path from "node:path";

const moveFilesInDir = async (dir, topLevel) => {
  for (const item of await fs.readdir(dir)) {
    const location = path.resolve(dir, item);
    const parsedLocation = path.parse(location);
    const details = await fs.lstat(location);

    if (details.isDirectory()) {
      await moveFilesInDir(location);
    } else if (parsedLocation.base === "index.html" && details.isFile && !topLevel) {
      const newName = parsedLocation.dir.split(path.delimiter).at(-1);
      const newLocation = path.resolve(parsedLocation.dir, "..", `${newName}.html`);
      await fs.cp(location, newLocation);
    }
  }
};

moveFilesInDir("build/client/", true);
