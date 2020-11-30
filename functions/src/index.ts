import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

// TODO: Make a shared lib with client.

admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    credential: admin.credential.applicationDefault(),
    // databaseURL: 'https://emerhub-test-1.firebaseio.com',
});

interface IStringValidator {
    isAcceptable(s: string): boolean;
}

// Costly operation, but this is just examples.
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const lettersRegexp = /^[A-Za-z]+$/;

class LettersOnlyValidator implements IStringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}

class EmailValidation implements IStringValidator {
    isAcceptable(s: string): boolean {
        return emailRegex.test(s)
    }
}

// Error Factory.
interface ErrorFactoryDefinition {
    key: string,
    validity: boolean,
    message: string,
}
interface IErrorFactory {
    create(key: string, validity: boolean, message: string): ErrorFactoryDefinition
}
class ErrorFactory implements IErrorFactory {
    create(key: string, validity: boolean, message: string): ErrorFactoryDefinition {
        return {
            key,
            validity,
            message,
        };
    }
}
//     (key: string, validity: boolean, message: string) => {
//     return {
//         key,
//         validity,
//         message,
//     }
// }

// ============================ Contact Update Trigger
export const onDataUpdate = functions
    .firestore
    .document("/contacts/{contactId}")
    .onWrite(async (change) => {

        const after: any = change.after.data();
        const before: any = change.before.exists ? change.before.data() : null;

        let couldBeUpdated = false;
        let percent: number = 0;
        const waitSecond = 1;


        // If Removed.
        if(before && !after) return null;

        // Time Guard
        if(after?.meta !== null) {
            const lastUpdate = after.meta?.dateLastUpdated?.toDate()?.getTime()
            const updateTime = new Date().getTime()
            couldBeUpdated = ((updateTime - lastUpdate)/1000) > waitSecond
        }

        // Newly Created
        if(before === null) {
            after._key = change.before.id
            after.meta.dateAdded = new Date()
            after.meta.dateLastUpdated = new Date()
            return change.after.ref.update(after);
        }

        if(after === before) {
            return null
        }

        // Calcuate Percentage
        // TODO: if this wrapped in a return function,
        //  ?somehow caused infinite loop, refactor this whenever able.
        const validation = {
            stringLength: (s: string, l: number): boolean => s.length > l,
            numberLength: (n: number, l: number): boolean => n.toString().length > l,
            emailValidation: (e: string): boolean => new EmailValidation().isAcceptable(e),
            lettersValidation: (e: string): boolean => new LettersOnlyValidator().isAcceptable(e),
        };

        // TODO: Refactor the factory to be more concise. e.g. removing key or make a factory to return object with property accessor.
        // Refactored with property accessor instead of iterable array.
        const errors = {
            'name': new ErrorFactory().create('name', validation.stringLength(after?.name, 5), 'Longer name required.'),
            'address': new ErrorFactory().create('address', validation.stringLength(after?.address, 5), 'Longer address required.'),
            'email': new ErrorFactory().create('email', validation.emailValidation(after?.email), 'Email is not valid.'),
            'note': new ErrorFactory().create('note', validation.stringLength(after?.note, 10), 'Minimum 10 characters.'),
            'job': new ErrorFactory().create('job', validation.stringLength(after?.job, 0), 'Please select a Job'),
        };

        const trueMap = Object.values(errors).filter((f: ErrorFactoryDefinition) => f.validity).length
        percent = Math.round((trueMap / Object.keys(errors).length) * 100);

        console.log(errors, "Errors")
        if(after._key && couldBeUpdated) {
            // TODO: Object assign wont merge with payload as well, refactor this as well, since .meta might be null
            after.meta.completion = percent;
            after.meta.errorMessage = errors;
            after.meta.dateLastUpdated = new Date();
            return change.after.ref.update(after)
        } else {
            return null;
        }
    })