import {FireStoreDataServices} from "@/services/DataServices";
import type {Ref} from "@vue/reactivity"
import {markRaw, reactive, ref, toRaw, toRefs} from "@vue/reactivity"
import {debounce, once} from 'lodash'

export class ContactDataService {
    get waitForPending(): boolean {
        return this._waitForPending;
    }

    set waitForPending(value: boolean) {
        this._waitForPending = value;
    }
    private dataServices: FireStoreDataServices;
    private readonly tableName: string;
    private _waitForPending: boolean;

    constructor(tableName: string){
        this.dataServices = new FireStoreDataServices();
        this.tableName = tableName
        this._waitForPending = false;
    }

    DocToContactRecordMap(doc: any): any {
        return {
            _key: doc.id,
            name: doc.data().name,
            address: doc.data().address,
            job: doc.data().job,
            note: doc.data().note,
            email: doc.data().email,
            meta: doc.data().meta
        }
    }

    willWait() {
        const waiter = this.dataServices.waitForPendingWrites;
        this.waitForPending ? (async () => await waiter())() : '';
    }

    Add<T>(contact: T): any {
        this.willWait()
        return this.dataServices.addRecord(contact, this.tableName)
    }

    Delete(recordID: string){
        this.willWait()
        return this.dataServices.deleteRecord(recordID, this.tableName)
    }

    Update<T>(docId: string, newData: T) {
        // const data = JSON.parse(JSON.stringify(newData));
        // data._key = docId;
        this.willWait()
        return this.dataServices.updateRecord(newData, this.tableName)
    }

    GetById(contactId: string): any {
        this.willWait()
        return this.dataServices.getRecord(contactId, this.tableName, this.DocToContactRecordMap);
    }

    ObserveById(contactId: string): any {
        this.willWait()
        return this.dataServices.observeRecord(contactId, this.tableName, this.DocToContactRecordMap)
    }

    ObserveAll(cb: object): any {
        this.willWait()
        return this.dataServices.observeRecords(this.tableName, cb)
    }

    GetAll() {
        this.willWait()
        return this.dataServices.getTableRecords(this.tableName, this.DocToContactRecordMap)
    }
}

const testLog = (...args: any) => {
    console.info(...args)
}

const appState: Ref<string> = ref('idle')
const dataState: Ref<IMachineState.IDataStateType> = ref('idle')
const error: Ref<any> = ref(null)

// TODO: object props should use ref(). then assigned with .value
const defaultState = (): IContact.IContactState => {
    return {
        selectedContactId: null,
        contacts: new Array<IContact.IContactData>(),
        contactData: {
            _key: null,
            name: '',
            address: '',
            email: '',
            note: '',
            job: '',
            meta: {
                completion: 0,
                dateAdded: null,
                dateRequest: new Date(),
                errorMessage: null,
            }
        }
    };
}


const cState: IContact.IContactState = reactive<IContact.IContactState>(defaultState())
const contactDataService = new ContactDataService('contacts')
let firstCreate = false;

// Not used yet, but consider to destructure contact state for SOLID reason.
const contactDataErrors: any = ref(cState.contactData.meta.errorMessage)
const contactDataMeta: any = ref(cState.contactData.meta)
let contactDataLocalCopy: any = markRaw({})

// TODO: make chainable clean class to control the flow.
export function useContacts() {

    /**
     * @description to manage the flow,
     * @TODO make a flow control class
     * @function
     */
    const appStateMethod: IMachineState.IAppStateMethod = {
        toIdle(){appState.value = 'idle'},
        toCreating(){appState.value = 'creating'},
        toEditing(){appState.value = 'editing'},
        isIdle(): boolean { return appState.value === 'idle' },
        isCreating(){ return appState.value === 'creating'},
        isEditing(){ return appState.value === 'editing'}
    }

    /**
     * @description Machine State.
     * @function
     */
    const dataStateMethod: IMachineState.IDataStateMethod = {
        isError: (): boolean => dataState.value === 'error',
        isIdle: (): boolean => dataState.value === 'idle',
        isSync: (): boolean => dataState.value === 'synced',
        isModified: (): boolean => dataState.value === 'modified',
        isRevoked: (): boolean => dataState.value === 'revoked',
        toError: () => dataState.value = 'error',
        toIdle: () => dataState.value = 'idle',
        toSync: () => dataState.value = 'synced',
        toModified: () => dataState.value = 'modified',
        toRevoked: () => dataState.value = 'revoked'
    }

    const resetFormState = () => {
        cState.selectedContactId = defaultState().selectedContactId;
        cState.contactData = defaultState().contactData;
    }

    const objectSerialization = (data: any) => {
        return JSON.parse(JSON.stringify(data));
    }

    const createLocalCopyOfContactData = (data: IContact.IContactData, waitForKey: boolean = false) => {
        if(waitForKey) {
            if("_key" in cState.contactData)
                contactDataLocalCopy = {...data};
        } else contactDataLocalCopy = {...data};
        return;
    }

    /**
     * @description Listener... push to the right state when returning.
     * @TODO Refactor this later, also querySnapshot typesafe and change typesafe, should be explicitly stated.
     */
    const load = async () => {
        contactDataService.ObserveAll((querySnapshot: any) => {
            querySnapshot.docChanges().forEach((change: any) => {
                const index = cState.contacts.findIndex((v: IContact.IContactData) => change.doc.data()._key)
                switch (change.type) {
                    case "added":
                        // if(change.doc.data()._key !== null)
                        cState.contacts.push(change.doc.data())
                        break;
                    case "modified":
                        if(index > -1)
                        cState.contacts[index] = reactive(change.doc.data());
                        cState.contactData.meta = reactive(cState.contacts[index]?.meta)
                        cState.contactData.meta.errorMessage = change.doc.data().meta?.errorMessage;
                        break;
                    case "removed":
                        if(index > -1)
                            cState.contacts.splice(index, 1)
                        break;
                }
            })

            // Ensuring
            const temp: Array<IContact.IContactData> = []
            querySnapshot.forEach((doc: any) => {
                if(doc.exists) temp.push(doc.data())
            })
            cState.contacts = temp;
        })
    }
    once(load);

    const observeCompletion = async () => {
        await contactDataService
        .ObserveById(cState.selectedContactId as string)
        .then((r: IContact.IContactData) => {
            cState.contactData.meta.completion = r.meta?.completion
        dataStateMethod.toSync()
    })}

    /**
     * @description Create Contact.
     * @return {void}
     * @function
     */
    const createContact = debounce(async () => {
        resetFormState();
        testLog('CreateContact', 'Inside Debounce')
        const doc: any = await contactDataService.Add(cState.contactData);
        cState.selectedContactId = doc.id
        appStateMethod.toIdle();
        dataStateMethod.toIdle();
        return;
    }, 2000);

    /**
     * To exit a function
     * @return {boolean}
     */
    const shouldHaveExitFunction = function () {
        // testLog('shouldHaveExitFunction')
        if(cState.selectedContactId === null) return true;
        return cState.contactData._key === null;
    }

    /**
     * @description Sync every input field. will be dbeounced on setup()
     * @return {Promise<void>}
     */
    const syncContactField = async function () {
        if(shouldHaveExitFunction()) return;
        cState.contactData.meta.dateRequest = new Date();
        dataStateMethod.toModified()
        if (appStateMethod.isEditing()) {
            try {
                await contactDataService.Update(
                    cState.selectedContactId as string,
                    cState.contactData
                )
                dataStateMethod.toSync()
            } catch (error) {
                dataStateMethod.toError()
            }
        }
        return;
    }

    /**
     * @description
     * This will create Blank contact document
     * When New Contact clicked, new document created on the database
     * will be listened for taking Key, then AppState changed to Modified
     *
     * Flow: ..
     * @todo need refactor as well.
     */
    const createBlankContactDocument = async () => {
        firstCreate = true;
        if(cState.contacts.length > 10) {
            error.value = "Contact List Exceeds Maximum Limit: 10"
            return;
        }
        appStateMethod.toCreating();
        if ( appStateMethod.isCreating() ) {
            if( !cState.selectedContactId  ) {
                const id = (await contactDataService.Add<IContact.IContactData>(cState.contactData)).id;
                // cState.contactData.meta.dateAdded = new Date() << supposed to be server responsibility
                // if("_key" in cState.contactData) {cState.contactData._key = id; }
                cState.selectedContactId = id
                cState.contactData._key = id
                dataStateMethod.toSync()
                createLocalCopyOfContactData({...cState.contactData})
            }
            if( cState.selectedContactId ) {
                await syncContactField()
                appStateMethod.toEditing();
                dataStateMethod.toSync()
            }
            return true;
        }
        return true;
    }

    /**
     * @description intended to clear the form and set to defaultState.
     * @todo supposed to use Watcher over selectedContactId,
     */
    const saveContact = async () => {
        testLog('saveContact', '')
        cState.selectedContactId = defaultState().selectedContactId;
        cState.contactData = defaultState().contactData
        appStateMethod.toIdle();
        dataStateMethod.toIdle();
    }

    /**
     * @description
     * Push delete event.
     * @param {string} recordId - firebase document ID
     * @param {string} key - Number Index of contacts
     * @return {Promise<void>} Returns nothing, inform Firebase to delete and put application state to Idle
     */
    const deleteContact = async (recordId: string) => {
        if(!recordId) return
        await contactDataService.Delete(recordId)
        appStateMethod.toIdle()
    }

    /**
     * Push Edit Event and change app state to Editing.
     *
     * @async
     * @param {string} recordId - firebase document ID
     * @return {void}
     */
    const editContact = (recordId: string) => {
        firstCreate = false;
        if(recordId === null) return;
        appStateMethod.toEditing()

        cState.selectedContactId = recordId;
        const id = cState.contacts.findIndex((v: IContact.IContactData) => v._key === recordId)
        const reef = ref<IContact.IContactData>()
        reef.value = cState.contacts[id];
        cState.contactData = reef.value;
        createLocalCopyOfContactData({...cState.contacts[id]});
    }

    const cancelEditing = async () => {
        const resetToIdle = () => {
            appStateMethod.toIdle()
            dataStateMethod.toIdle()
            resetFormState();
        }

        const id = cState.contacts.findIndex((v: IContact.IContactData) => v._key === cState.selectedContactId)

        if(firstCreate) {
            if(cState.selectedContactId)
                await deleteContact(cState.selectedContactId);
            resetToIdle()
        } else {
            cState.contacts[id].name = {...toRaw(contactDataLocalCopy)}.name;
            cState.contactData = {...toRaw(contactDataLocalCopy)};
            resetToIdle()
        }



        // if(appStateMethod.isCreating()) {
        //     cState.contactData = reactive(objectSerialization(contactDataLocalCopy));
        //
        //     if(cState.selectedContactId)
        //         await contactDataService.Update(cState.selectedContactId as string, cState.contactData);
        //
        //     appStateMethod.toIdle()
        //     dataStateMethod.toIdle()
        //     resetFormState();
        // }
        //
        // if(appStateMethod.isEditing()) {
        //     cState.contactData = reactive(objectSerialization(contactDataLocalCopy));
        //
        //     if(cState.selectedContactId)
        //         await contactDataService.Update(cState.selectedContactId as string, cState.contactData);
        //
        //     dataStateMethod.toIdle()
        //     appStateMethod.toIdle()
        //     resetFormState();
        // }
    }

    // Form completion escaping undefined TS.
    const formCompletion = function (): number {
        return cState.contactData.meta?.completion !== undefined ? cState.contactData.meta?.completion : 0;
    }

    /**
     * @param {IContact.TFields} key
     * @return IContact.TErrorMessage
     **/
    const formErrorMessage = function(key: IContact.TFields): IContact.TErrorMessage {
        if(cState.contactData.meta?.errorMessage !== null) {
            return reactive({
                key: ref(cState.contactData.meta?.errorMessage[key].key),
                validity: ref(cState.contactData.meta?.errorMessage[key].validity),
                message: ref(cState.contactData.meta?.errorMessage[key].message),
            })
        } else {
            return {
                key: key,
                validity: true,
                message: '',
            }
        }
    }

    /**
     * Used for programmatic styling
     *
     * @param {string} condition (eg.g < || > || = || == || ===)
     * @param {number} n (e.g. 50)
     * @param {string} ifTrue (String to echo when condition is true, e.g. class name)
     * @param {string} ifFalse (String to echo when condition is false, e.g. class name)
     * @return string
     **/
    const ifCompletion = (
        condition: string,
        n: number,
        ifTrue: string,
        ifFalse: string
    ): string => {
        let result = false;
        switch (condition) {
            case "<":
                result = formCompletion() < n;
                break;
            case ">":
                result = formCompletion() > n;
                break;
            case "=":
            case "==":
            case "===":
                result = formCompletion() === n;
                break;
        }
        return result ? ` ${ifTrue} ` : ` ${ifFalse} `;
    };

    return {
        ...toRefs(cState),
        appState,
        appStateMethod,
        cancelEditing,
        contactDataErrors,
        contactDataMeta,
        createBlankContactDocument,
        createContact,
        dataState,
        dataStateMethod,
        deleteContact,
        editContact,
        error,
        formCompletion,
        formErrorMessage,
        ifCompletion,
        load,
        saveContact,
        syncContactField,
    }
}