declare namespace IMachineState {
    export type IDataStateType = 'synced' | 'error' | 'idle' | 'modified' | 'revoked'
    export interface IAppStateMethod {
        isIdle: () => boolean,
        toIdle: () => void,
        isCreating: () => boolean,
        toCreating: () => void,
        isEditing: () => boolean,
        toEditing: () => void,
    }
    export interface IDataStateMethod {
        toIdle: () => void,
        toSync: () => void,
        toError: () => void,
        toModified: () => void,
        toRevoked: () => void,
        isIdle: () => boolean,
        isSync: () => boolean,
        isError: () => boolean,
        isModified: () => boolean,
        isRevoked: () => boolean,
    }
}