import { Storage, Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';


async function getStorage(dbName) {
    const storage = new Storage(
        '__main_db',
        driverOrder: [
            CordovaSQLiteDriver._driver,
            Drivers.IndexedDB,
            Drivers.LocalStorage
        ]
    );
    
    await storage.defineDriver(CordovaSQLiteDriver);
    await storage.create();
    return storage;
}

export default {
    Note: getStorage('__Note'),
    User: getStorage('__User')
};
