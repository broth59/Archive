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
