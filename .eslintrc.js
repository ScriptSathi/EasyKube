module.exports = {
    'env': {
        'es6': true,
        'node': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'project': './tsconfig.json',
        'sourceType': 'module',
        'ecmaVersion': 2022,
    },
    'plugins': [
        'eslint-plugin-jsdoc',
        'eslint-plugin-prefer-arrow',
        'eslint-plugin-import',
        '@typescript-eslint',
    ],
    'rules': {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/dot-notation': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': ['error', {
            'accessibility': 'explicit',
            'overrides': {
                'constructors': 'no-public',
            },
        }],
        '@typescript-eslint/indent': ['error', 4, {
            'FunctionDeclaration': {
                'parameters': 'first',
            },
            'FunctionExpression': {
                'parameters': 'first',
            },
            'CallExpression': {
                'arguments': 'off',
            },
            'ObjectExpression': 'off',
            'ignoredNodes': ['ArrowFunctionExpression > BlockStatement', 'TSInterfaceDeclaration TSMethodSignature *', 'TSUnionType *'],
        }],
        '@typescript-eslint/member-delimiter-style': ['error', {
            'multiline': {
                'delimiter': 'semi',
                'requireLast': true,
            },
            'singleline': {
                'delimiter': 'semi',
                'requireLast': false,
            },
        }],
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-this-alias': 'error',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
        '@typescript-eslint/no-unused-expressions': [
            'error',
            {
                'allowShortCircuit': true,
                'allowTernary': true,
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                'ignoreRestSiblings': true,
            },
        ],
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                'avoidEscape': true,
                'allowTemplateLiterals': true,
            },
        ],
        "@typescript-eslint/return-await": "error",
        '@typescript-eslint/semi': [
            'error',
            'always',
        ],
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/triple-slash-reference': [
            'error',
            {
                'path': 'always',
                'types': 'prefer-import',
                'lib': 'always',
            },
        ],
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-parens': [
            'off',
            'always',
        ],
        'comma-dangle': 'off',
        'comma-spacing': ['error', { 'before': false, 'after': true }],
        '@typescript-eslint/comma-dangle': [
            'error',
            {
                'arrays': 'always-multiline',
                'objects': 'always-multiline',
                'imports': 'always-multiline',
                'exports': 'always-multiline',
                'functions': 'always-multiline',
                'enums': 'always-multiline',
                'generics': 'always-multiline',
                'tuples': 'always-multiline',
            },
        ],
        'complexity': 'off',
        'constructor-super': 'error',
        'curly': [
            'error',
            'multi-line',
        ],
        'eol-last': 'error',
        'eqeqeq': [
            'error',
            'smart',
        ],
        'guard-for-in': 'error',
        'indent': 'off',
        'id-blacklist': 'off',
        'id-match': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-internal-modules': ['error', {
            'allow': ['**/protobuf/*', 'source-map-support/*'],
        }],
        'import/no-default-export': 'error',
        'import/order': ['error', {
            'groups': [
                ['builtin', 'external'],
                'internal',
                ['parent', 'sibling', 'index'],
                'object',
            ],
            'newlines-between': 'always',
        }],
        'jsdoc/check-alignment': 'error',
        'jsdoc/check-indentation': 'off',
        'jsdoc/newline-after-description': 'error',
        'keyword-spacing': ['error', {
            'before': true,
            'after': true,
        }],
        'max-classes-per-file': 'off',
        'max-len': ['error', {
            'code': 160,
        }],
        'new-parens': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': 'error',
        'no-constant-condition': 'off',
        'no-debugger': 'error',
        'no-duplicate-case': 'error',
        'no-duplicate-imports': 'error',
        'no-empty': 'error',
        'no-eval': 'error',
        'no-extra-bind': 'error',
        'no-fallthrough': 'off',
        'no-invalid-this': 'off',
        'no-irregular-whitespace': ['error', {
            'skipStrings': false,
            'skipComments': false,
            'skipRegExps': false,
            'skipTemplates': false,
        }],
        'no-multiple-empty-lines': ['error', { 'max': 1 }],
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-param-reassign': ['error', {
            'props': false,
        }],
        'no-redeclare': 'error',
        'no-return-await': 'off',
        'no-sequences': 'error',
        'no-shadow': 'off',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'off',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-unsafe-finally': 'error',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'object-curly-spacing': ['error', 'always'],
        'object-shorthand': 'error',
        'one-var': [
            'error',
            'never',
        ],
        'prefer-const': 'error',
        'prefer-object-spread': 'error',
        'quote-props': [
            'error',
            'as-needed',
        ],
        'radix': 'error',
        'space-before-function-paren': [
            'error',
            {
                'anonymous': 'always',
                'named': 'never',
            },
        ],
        'space-in-parens': [
            'error',
            'never',
        ],
        'spaced-comment': [
            'error',
            'always',
            {
                'markers': [
                    '/',
                ],
            },
        ],
        'use-isnan': 'error',
        'valid-typeof': 'off',
    },
};
