import { Storage, Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';


async function getStorage(dbName) {
    const storage = new Storage({
        name: dbName,
        driverOrder: [
            CordovaSQLiteDriver._driver,
            Drivers.IndexedDB,
            Drivers.LocalStorage
        ]
    });
    
    await storage.defineDriver(CordovaSQLiteDriver);
    await storage.create();
    return storage;
}

export const NoteStorage = getStorage('__Note');
export const UserStorage = getStorage('__User');

