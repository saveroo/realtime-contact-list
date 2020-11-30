/**
 * @summary
 * Fields
 * - "name" | "address" | "email" | "job" | "note"
 * State
 *  - Selected Contact ID
 *  - Contacts
 *      - Contact Data
 *      - Contact Data
 *      - ...
 *  - Contact Data
 *      - ...
 *      - Contact Meta Data (Server Validation)
 *          - Date
 *          - Completion
 *          - Errors
 *              - Field Key
 *                  - Field Error
 *              - Field
 *                  - Field Error
 **/
declare namespace IContact {
    // Fields
    type TFields = "name" | "address" | "email" | "job" | "note"

    // FB
    export type TFirebaseDocumentId = string | null

    // Object schema to expect from meta.errorMessage
    export interface TErrorMessage {
        "key": string,
        "validity": boolean,
        "message": string,
    }

    // Can be made generic, TAccessor<K>
    // Strict property access.
    export type TContactMetaErrorMessage = {
        [key in TFields]: TErrorMessage
    }

    // export interface IContactMetaErrorMessage {
    //     [key: string]: TErrorMessage,
    // }

    export interface IContactMeta {
        completion: number
        errorMessage: TContactMetaErrorMessage | null,
        dateAdded?: any,
        dateLastUpdated?: any,
        dateRequest?: any,
    }

    export interface IContactData {
        _key: TFirebaseDocumentId,
        name: string,
        email: string,
        address: string,
        job: string,
        note: string,
        meta: IContactMeta
    }

    export interface IContactState {
        selectedContactId?: string | null,
        contacts: Array<IContactData>,
        contactData: IContactData
    }
}