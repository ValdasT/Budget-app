# Budget-app
## Usage

https://user-images.githubusercontent.com/35199948/191195522-caf52627-563a-4652-9a7b-99c5d92e82bb.mp4

- Simple budget planning application. React was used to develop the front end of this application, while Node.js was used to create the back end. This project also uses the MongoDB database for its data. For the chat integration, this project is set up to work with the Watson Assistant service.

## Start project localy
  - Clone git repository: 
  ```sh
 git clone https://github.com/ValdasT/Budget-app.git
  ```
  - Install the dependencies:
```sh
cd Budget-app
cd frontend
npm install
```
```sh
cd Budget-app
npm install
```
  - Create a `.env` local file to hold environment variables and create values:
  >MONGO_USER=
  >
  >MONGO_PASSWORD=
  >
  >MONGO_DB=
  >
  >WATSON_ASSISTANT_ID=
  >
  >WATSON_API_KEY=

- To start the development server run:
```sh
npm run dev
```
- Visit `http://localhost:3000` to view your application.
