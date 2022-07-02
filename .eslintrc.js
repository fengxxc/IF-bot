module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        //  "project": ["./tsconfig.json"] 
        "ecmaVersion": "latest", // Allows the use of modern ECMAScript features
        "sourceType": "module", // Allows for the use of imports
    },
    "extends": [
        "plugin:@typescript-eslint/recommended"
    ],
    "env": {
        "node": true, // Enable Node.js global variables
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-console": "off",
        "import/prefer-default-export": "off",
        "@typescript-eslint/no-unused-vars": "warn",
    },
    "ignorePatterns": ["src/**/*.test.ts", "src/frontend/generated/*", "dist"],
}