# Installation 

1.	`install` essentials

    ```shell    
	$ sudo apt-get install build-essential libssl-dev
    ```    
2.	`install` nvm

    ```shell
    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
    ```

3.	`apply` path

    ```shell
    $ source ~/.bashrc
    ```    

4.	`check` nvm version 

    ```shell
    $ nvm --version
    ```    

5.	`install` node through nvm
	
    ```shell
    $ nvm install 12
    ```

1. `check` node version

    ```shell
	$ node --version
    ```


# Tools


## yarn
>npm alternative made by facebook

### Installation
    
+ `Add` yarn repository 

    ```shell
    $ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    ```
    ```shell
    $ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    ```
+ `Install` yarn without node

    ```shell
    $ sudo apt install --no-install-recommends yarn
    ```
+ `Check` yarn version

    ```shell
    $ yarn --version
    ```
  


