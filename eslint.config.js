const { defineConfig, globalIgnores } = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const prettier = require("eslint-plugin-prettier");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

module.exports = defineConfig([
	{
		languageOptions: {
			parser: tsParser,
			sourceType: "module",
			ecmaVersion: 2023,
			parserOptions: {},

			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		extends: compat.extends(
			"prettier",
			"eslint:recommended",
			"plugin:@typescript-eslint/recommended",
		),

		plugins: {
			prettier,
			"@typescript-eslint": typescriptEslint,
		},

		rules: {
			"prettier/prettier": [
				"warn",
				{
					__comment:
						"for now, this needs to be synchronized manually with settings in .prettierrc, it will be fixed in future",
					endOfLine: "auto",
					singleQuote: false,
					printWidth: 80,
					tabWidth: 4,
					useTabs: true,
				},
			],
		},
	},
	globalIgnores(["**/webpack.config.js", "dist/**/*", "eslint.config.js"]),
]);
