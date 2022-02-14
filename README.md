# RedefinIT Bare Metal Automation

Python version: 3.6.8

For Development env: 
Node version: v14.16.1
NPM version: 6.14.12

Note: If you see errors from "npm install" command then run the following command and repeate "npm install"
```
# npm install  --unsafe-perm node-sass@4.13.1 
```


**To run** this application, execute the following commands:

  1. Install NPM modules

    ```
    $ npm install (or yarn install)
    ```

  2. Start the back-end server:

    ```
    $ npm run dev-server
    ```

  3. Start the front-end dev server:

    ```
    $ npm run dev
    ```

  4. Create the app distribution to be used by a back-end server

    ```
    $ NODE_ENV=production grommet pack
    ```

  5. Start the server in production mode:

    ```
    $ npm start
    ```

  6. Test and run linters:

    ```
    $ npm test
    ```
=======
