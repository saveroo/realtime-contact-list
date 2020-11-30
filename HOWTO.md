#### Prerequisite
- Google Cloud Function / Firestore (/functions) 
    - Node V 12
- Vue 3 
    - Node V 14
    
#### How to run

1. Clone the repository `git clone`
2. Go to project folder with unix `cd projects` || `dir projects`

- Yarn Dev:
1. `yarn install`
2. `yarn serve`
3. `yarn deploy --only functions`
- Yarn Deployment:
4. `yarn install`
6. `yarn serve`
7. `yarn build`

NPM:
1. Goto /functions folder and 
- Development
5. `npm install`
6. `npm run serve`
1. `npm run build`

- Production
2. `npm install`
3. `npm run serve`
4. `npm run deploy`

- Clone the repository 
> `git clone`
- Go to project folder with 
>`cd projects` || `dir projects`
- Go to function folder with `cd functions`
    -  || `yarn install`
    - Dev:  || `yarn serve`
    - Prod:  || `yarn deploy`
- Go to front-end folder with `cd front`
    -  || `yarn install`
    -  || `yarn serve`
    - Dev:  || `yarn serve`
    - Build:  || `yarn build`