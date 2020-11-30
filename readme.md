# Vue 3 + Firestore + Cloud Function + Typescript
An example of Vue 3 (Composition API), Typescript, Google Cloud Function, Firestore, Tailwind CSS

Demo: [REDACTED] 

### Overview
A Contact Collection Apps with one specific purpose to "Save Contacts" with abilities to 
`save`, `cancel`, `edit`, `delete`, `realtime autosave` and `scroll through the document`. 
although the requirement does not specify about listing the data, and since I missed the 24 hours deadline to put in time, 
scaling up the requirement to represent an approach as well as tackling specific use case can be considered as a very valuable 
yet exciting task in order to grow and learn with another stack despite the constraint, 
would love to hear any kind of suggestion, critics, and question, it will be greatly appreciated. Thanks.

### Objectives ( What's really covered )
- [x] Client Autosave Debounce
- [x] Serverless form completion rate calculation
- [x] Serverless error label validation
- [x] onWrite/onUpdate
- [x] No HTTP.
- [x] 5 Fields
- [x] Docs, Approach, Flow. 

### What's `not really` covered
- Build to scale
- Build to be completely reusable
- Performance wise
- Real-world Validation
- Plenty of design pattern implementation examples.
- Cost wise.
- Best Practice.
- Clean Architecture.
    
### Index
1. Not yet

#### Directory/Files structure and explanation
This will explain a bit about the structures.

- /front/
    - .env (used to store private information)
    - .env-example (used to store private information)
    - ./tests/unit (Few tests are written)
    - ./src (where files relies)
        - **/firebaseConfig.ts** (firebase SDK initialization and options)
        - **/app.vue** (since this only has single purpose, app.vue will be main entry to wrap component)
        - **/types** (to store declaration, interfaces)
        - **/services** (to store services or classes)
        - **/composables** (to store application shared logic across component)
        - **/store** (vuex store, initially used as a composition state folder, abandoned)
        - **/assets** (store Tailwind.css assets)
        - **/components** (where component relies)
    - /src/components (Used files prefixed with [Contact])
        - **Container.vue** (act as a div wrapper)
        - **EditForm.vue** (Main form to edit/save with debounced autosave)
        - **List.vue** (Async component used to receive props and loop over)
        - **Lists.vue** (Imported by main entry)
        - **CustomField.vue** (Asynchronous Dynamic Render Function Form Fields component)
        - **NewButton.vue** (To Create new Contact)
        - **ServerState.vue** (Currently not usable)
        - **ProgressBar.vue** (Currently not used)
    - /src/types (Used files prefixed with [Contact])
        - **contact.types.ts** (Namespace declaration of IContact interface for prefix)
        - **state.types.ts** (Namespace declaration of machine state/data state)

- /functions
    - ./src
        - **index.ts** (.onWrite background function to handle both adding and updating.)

#### Data Schema Explanation
This will explain a bit about the data schema used for this specific apps.

- **selectedContactId**: (For currently selected contact)
- **contacts**: (Lists of `contactData` in array, should be refactored with property accessor)
- **contactData**: (Contact data fields)
    - **_key**: (a unique clone of firebase random docId, prefixed with _ to denote responsibily/importance)
    - **name**: (Name of contact)
    - **address**: (address is string)
    - **email**: (contact email)
    - **note**: (contact note)
    - **job**: (contact Job)
    - **meta**: (metadata of schema, server transformed payload)
        - **completion**: (Contact Data Field form completion rate in number)
        - **dateAdded**:  (Functions responsibility)
        - **dateRequest**: ()
        - **errorMessage**: (server payload)
            - **key**: Props key of `contactData` field
               - **validity**: validation validity.
                - **message**: error message.

#### Front
Form consist of `5 Field` and `2 Button`, and `1 button` to create.
`2` more button to `Edit` and `Delete`.

Form Field: 
- Name
- Address
- Email
- Phone
- Message

Form Button:
- Save 
- Cancel 

Flow:
- Use `onSnapshot` Listener.
- Create Contact
    - Will set [appState] to [creating]
    - Will send [Blank Data] to server
    - Receive the data with firebase [DocumentId]
    - Pushed to reactive local state
    - Will set [appState] to [editing] ASAP.
- Save Button
    - Will set to [idle] state
    - Will clearing the data for next action
    - Disabled if form aren't validated.
    - Disabled if [dataState] is not in [synced] state
- Cancel Button
    - Will [clone] data from listener, upon invocation
    - Will set to [idle] state
    - Will reset form [v-model].
    - Revert the data back to the first time by creating a clone and deserializing reactivity
- Delete Button
    - Will set to [idle] state
    - will invoke [.delete] to remove data from DB
- Edit Button
    - Will set [contactData] from [contacts]
    - Will set [appState] to [editing]
        
##### Application Flow:
1. **[Client]** On Vue instance creation, client will listen with Firebase SDK onSnapshot
1. **[Client]** On Create New Contact clicked, client will create a blank document
1. **[Client]** A form will show immediately.
1. **[Client]** Every input will be debounced by a second before executed and trigger **[Functions]** *onWrite*
1. **[Functions]** If data doesn't exist append a document id to _key field
1. **[Functions]** If data doesn't exist append a document with meta field server timestamp
1. **[Functions]** If data does exist check for lastUpdated timestamp and compare with current time
1. **[Functions]** If lastUpdated is above 1 second compared to current time, continue the process.
1. **[Functions]** Then will validate **[Client]** payload and append meta completion with factory generated errors object. 
1. **[Client]** will listen for added and modified event,
1. **[Client]** under added scope **[Client]** will push the data to local state
1. **[Client]** under modified scope **[Client]** will push reactive data into reaction
1. **[Client]** Forms then will reading from contacts collection while simultaneously updating.
1. **[Client]** will display Contact Data in ContactList.vue with buttons Edit Delete 

##### Client:

###### **[Client]** Has 3 Application state (Idle/Editing/Creating)
- **[Creating]** `Creating` state will trigger a push to local state and wait for document `id`
- **[Creating]** `Creating` state will programmatically set to `editing` state after document `id` is found.
- **[Idle]** `Idle` state is the default application state.
- **[Idle]** `Idle` state will put everything back into default
- **[Idle]** `Idle` state will hide forms
- **[Idle]** `Idle` state will reset form back to default state.
- **[Editing]** `Editing` state trigger an update to `selected` `contact data`
- **[Client]** States act as a guard to control the flow.

###### **[Client]** Has 3 Data state `synced`, `modified`, `idle`
- **[sync]** `sync` state indicated with solid green blip on top of the edit forms.
- **[modified]** `modified` state indicated with pulsing green blip on top of the edit form.
- **[idle]** are currently not used except as a default state.
- **[Synced]** `sync` state used to show that data are `autosaved` and client representation are in sync with the server
- **[modified]** `modified` state used to show there's pending update that is not yet listened for confirmation.

##### Server:
- **[Functions]** has several function
- **[Functions]** act as a initial document creation.
- **[Functions]** act as a field completion rate calculation.
- **[Functions]** act as an error factory
- **[Functions]** act to transform data and giving the required fields
- **[Functions]** guarded by few conditional and rate limiting per second.
       
##### Facts:
- Few code are well commented following TSDoc(in proposal)/JSDoc standard. 
- Typescript namespace declaration /src/types
- Written with composables approach

### Language/Framework feature used
##### Vue 3:
- Composition API (setup(), composable patterns)
- Dynamic Render Components (to create CustomField component)
- SFC
- Suspense API Used (To display fallback when error captured)
- Async Component (ContactList)

##### TypeScript:
- Services Class (To wrap firebase re-usable services)
- Interfaces (To create data schema standard)
- Types (To handle param input strictly)
- Generic
- Property Accessor (To ease querying a consistent error object.)
- Type Casting (To avoid use of `any`)
- Simplified Factory (To create error, validation)

##### Cloud Functions / Firestore
- Timestamp
- Data transforming
- Use of .onUpdate but rewritten with .onWrite to handle broader cases.
- Rules aren't applied yet.


##### DB Save

[logo]: docs/firestore-metrics.PNG "Firestore Metrics"
[logo]: docs/function-logs.PNG "Google Cloud Functions Invocation"

---

### Known Bugs / Fixed Bugs
- [x] Render Functions components won't read reactivity from the server. Error Message cases.
    - done: making it imported as async component
    - done: wrap VNode const into arrow function.
- [ ] Lists null handling, when creating new contact when server/emulator not responding.
- [ ] waitForPending seems to make form completion inconsistent, fix it soon.

### TODO
Note with TODO prefix automatically detected inside source code by the IDE.

- [ ] UI handling when server/emulator not responding.
- [ ] TODO: Make a draft collection, before pushing to main collection.
- [ ] TODO: Make a state/meta/connection collection. utilizing offline capabilities.
- [ ] TODO: Fix TSLint Rules, should be `IDataServices` as naming convention.
    - Need to add TSLint package explicitly but somehow my PC are troublesome doing npm/yarn install, even removing.
- [ ] TODO: make chainable clean class to control the flow. builder patterns with observer might help.
- [ ] TODO: Make a shared lib/interface with client
    - to minimize redundancies, also share reusable interface, class, code.
- [x] TODO: Refactor the factory to be more concise. 
    - e.g. removing key or make a factory to return object with property accessor.
- [ ] TODO: Object assign wont merge with payload as well, refactor this as well, since .meta might be null
    - e.g. Destructure the payload without mutating directly
- [ ] TODO: Resolve with a better approach
    - Currently ObserveRecords are nifty hacks, utilizing callback to jump into the scope.
    - resolving a promise call on `querySnapshot` directly gives strange behavior,
    - it eliminate `docChanges` event being passed on.
- [ ] TODO: Global Component works, however IDE intelisense couldn't detect
    - e.g. Manage import under `main.ts`, so it can be called directly in any component.
    - need to consider bundle size as well if it can't be tree shaked, need to find a way.
- [ ] TODO: supposed to use Watcher over selectedContactId,
    - e.g. Should observe contact ID with vue Watcher rather than employing kind of comparation manually.
- [ ] TODO: Make a function to generate node from array of input objects for simple component.  
    - JSX Component, can be improved to parse into defined object to easily create standarize custom component.
- [x] TODO: Refactor this, performance problem, server should return indexer access instead.
    - Has been done, due to array need to be iterated over, for every observed input.
- [ ] TODO: refactor local setup() into composable if neccessary. 
- [ ] Remove lodash and use native equivalent
    - Need to create an interface as well.
    - Or use lodash.debounce, to reduce bundle sizes.
- [ ] Should be performance wise and reduce bundle sizes as well.
- [ ] TESTS. Composables should be testable.
- [ ] Remove unnecessary code.
- [ ] README should provide link to each mentioned folder to ease reader.
- [ ] Commented the code entirely, Generating JSDoc pages for shared logic. 
- [ ] Proper `TailwindCSS` styling, separation of concern wise. 