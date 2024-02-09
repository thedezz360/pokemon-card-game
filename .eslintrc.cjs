module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict-type-checked",
		"plugin:react/recommended",
		'plugin:react-hooks/recommended',
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
		project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
	},
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	"plugins": [
		"@typescript-eslint",
		"react",
		"react-refresh"
	],
	"rules": {
		'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"react/react-in-jsx-scope": "off"
	}
};
