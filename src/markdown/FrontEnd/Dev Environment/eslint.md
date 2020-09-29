### ESlint
> Coding style Novice for Javascript 

* **Configuration**

```javascript
//.eslintrc.js
module.exports = {
	/* Target */
    files: [ './src/*' ],
    ignorePatterns : [ '/node_modules/' ],
    
    
	/* Javascript Specificatoin */
	// Global Variable Environment
    env: {
    	browser: true,
        node: false
    },
    globals: {
    	$: true
    },
    
    /* AST Parser */
    parser: '@typescript-eslint/parser' || 'babel eslint',
    parsetOptions: {
    	ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
        	jsx: true
        }
    },
    
	/* Code Style */
    // Third part library : Rule Provider
    plugins: [
        'react',
    	'import',
        '@typescript-eslint',
        //jsdoc,	--javascript document linter
        //markdown, --gitgub markdown preprocessor linter
        //prettier  --prettier ingnore
    ],
    //Linting Rule preset
    extends:[
        'eslint:recommended',
        'plugin:react/recommeded',
        'plugin:import/recommeneded',
        'plugin:@typescript-eslint/eslint-recommeded',
        //prettier,
        //prettier/@typescript-eslint
    ],  
    //Linting Rule
    rules: {
		'semi': 'error',		//force semicoolon
        'no-console': 'error'   //emit error on console.log ...
	},
    
    /* Override */
    overrides: {
    	filse: [ ... ],
        rules: { ... }
    }
    
}

```

* **Dependencies**
```shell
    s
```

* **Export**  

1.  `Init project` which of name startsWiths 'eslint-config-'


```
eslint-config-[설정 이름]/
 ├── index.js
 └── package.json
```
2.  `Specify` eslint dependencies

```json
//package.json
{
  "name": "eslint-config-[설정 이름]",
  "peerDependencies": {
    "eslint": ">=6",
    "eslint-plugin-import": "^2.18.2"
     // ...
  }
}


```

3.  `publish` project

```shell
$ npm pulish
```
