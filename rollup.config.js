const fs = require('fs')
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/empty.js",
  output: {
		file:"dist/empty.js",
    format: "es",
    sourcemap: true,
    plugins: [
      terser({ keep_classnames: true, keep_fnames: true }),
			{
        name: 'test plugin',
        writeBundle(options) {
            fs.unlinkSync(options.file)
						fs.unlinkSync(options.file+".map")
        }
    }
    ],
  },
  plugins: [
    copy({ targets: [{ src: "src/*", dest: "dist" }] }),
    nodeResolve(),
  ],
};