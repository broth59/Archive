# VSCODE 
## installation

1. `install` curl   
    ```shell
    $  apt-get install curl
    ``` 

2. `download` GPG Authentication Key
    ```shell
    $  sudo sh -c 'curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg'
    ```

3. `Add` Micorsoft ubuntu repository
	```shell
    $  sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list'
    ```

4. `Update` apt-get
    ```shell
	$  apt-get update
    ```

5. `install` vscode
	```shell
    $ apt-get install code
    ```

## Extenstion

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

### Prettier
>Code literal formatter


* **Configuration**
    
```json
//.prettierrc
{
  "singleQuote": true,     // 따옴표 고정
  "semi": true,            // 코드 끝에 ; 설정
  "useTabs": false,        // Tap 사용여부
  "tabWidth": 2,           // Tap 크기
  "trailingComma": "all",  // 객체 끝 부분에도 Comma 추가
  "printWidth": 100        // 줄 당 max length
}

```

```json
//setting.json
{
  [javascript]: {
		"editor.formatOnSave": true,
      	"prettier.semi": false,
      	"prettier.printWidth": 100
  }
}

```

```javascript
    const a = 'gkq'
    function tt(){
        console.log(good)
    }
```