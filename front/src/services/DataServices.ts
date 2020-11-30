import {db} from '@/firebaseConfig';
import firebase from "firebase";
// import IGuestFormState = IFormState.IGuestFormState;

// TODO: Fix TSLint Rules, should be IDataServices as naming convention.
interface DataServices {
    // Adding record
    addRecord(docId: string, recordObject: any, tableName: string): Promise<any>
    // Update Record
    updateRecord(recordObject: any, tableName: string): Promise<any>
    // Read Record
    getRecord(recordID: string, tableName: string, docConverter: any): Promise<any>
    // Get all Record
    getTableRecords(tableName: string, docConverter: any): Promise<any>
    // Observe Record
    observeRecord(recordId: string, tableName: string, docConverter: any): Promise<any>
    // Observe All Record
    observeRecords(tableName: string, docConverter: any): Promise<any>
    // Observe All Record
    // observeRecords(tableName: string, docConverter: any): Promise<any>
    // Delete Record
    deleteRecord(recordObject: any, tableName: string): Promise<any>
    waitForPendingWrites(): Promise<void>
}

export class FireStoreDataServices implements DataServices {

    addRecord(recordObject: any, tableName: string) {
        return new Promise( (resolve, reject) => {
            db.collection(tableName)
                .add(recordObject)
                .then((docRef) => {
                    console.info("Written", docRef)
                    resolve(docRef)
                })
        });
    }

    updateRecord(recordObject: any, tableName: string) {
        return new Promise( (resolve, reject) => {
            try {
                db.collection(tableName)
                    .doc(recordObject._key)
                    .set(recordObject)
                    .then((docRef) => {
                        console.log("Updating Record..")
                        resolve(docRef)
                    })
                    .catch((e) => {
                        reject(e)
                    })
            } catch (e) {
                reject(e)
            }
        });
    }

    getRecord(recordID: string, tableName: string, docConverter: any) {
        return new Promise( (resolve, reject) => {
            try {
                db.collection(tableName)
                    .doc(recordID)
                    // .withConverter(docConverter)
                    .get()
                    .then((doc) => {
                        doc.exists ? resolve(docConverter(doc)) : reject("No Record Found")
                    })
            } catch(e) {
                reject(e)
            }
        });
    }

    observeRecord(recordId: string, tableName: string, docConverter: any) {
        return new Promise((resolve, reject) => {
            try {
                db.collection(tableName)
                    .doc(recordId)
                    .onSnapshot({
                        includeMetadataChanges: true
                    }, doc => {
                        // console.log("Observer", doc.metadata.hasPendingWrites, doc.data())
                        doc.exists ? resolve(doc.data()) : reject([
                            `[Record Exists] ${doc.exists}`,
                            `[Record Pending] ${doc.metadata.hasPendingWrites}`
                        ])
                    })
            } catch(e) {
                reject(e)
            }
        })
    }

    // TODO: Resolve with a better approach
    // Considered inefficient and dirty hacks,
    // somehow immediately resolving querySnapshot wont return @event type
    observeRecords(tableName: string, cb: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                db.collection(tableName)
                    .onSnapshot({ includeMetadataChanges: true },
                        querySnapshot => {
                            resolve(cb(querySnapshot))
                        }, (err) => {
                            reject(err)
                        })
            } catch(e) {
                reject(e)
            }
        })
    }

    deleteRecord(recordID: string, tableName: string) {
        return new Promise((resolve, reject) => {
            try {
                db.collection(tableName)
                    .doc(recordID)
                    .delete()
                    .then((doc) => {
                        console.log("deleteRecord", doc)
                    resolve(doc);
                }).catch((error) => {
                    reject(error);
                });
            } catch(e) {
                reject(e)
            }
        });
    }

    getTableRecords(tableName: string, docToRecordMap: any) {
        return new Promise(function (resolve, reject) {
            try {
                const records: any = [];
                db
                    .collection(tableName)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            records.push(docToRecordMap(doc))
                        })
                        resolve(records)
                    })
                    .catch(err => { reject(err) })
            } catch(e) {
                reject(e)
            }
        });
    }

    async waitForPendingWrites(): Promise<void> {
        console.log('[WAIT]');
        return await db.waitForPendingWrites();
    }
}


// export function DocToGuestRecordMap(doc: any): IGuestFormState  {
//     const row = doc.data()
//     return {
//         name: row.name,
//         email: row.email,
//         address: row.address,
//         phone: row.phone,
//         message: row.message,
//         completion: row.completion
//     }
// }
