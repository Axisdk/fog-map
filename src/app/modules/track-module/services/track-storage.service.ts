import { Service } from '@angular/core';
import { TrackPointInterface } from '../interfaces/track-point.interface';
import {
  trackDbNameConst,
  trackDbVersionConst,
  trackPointsStoreNameConst,
} from '../consts/track-storage.const';

@Service({ autoProvided: false })
export class TrackStorageService {
  private _dbPromise: Promise<IDBDatabase> | null = null;

  private _openDb(): Promise<IDBDatabase> {
    if (this._dbPromise) return this._dbPromise;

    this._dbPromise = new Promise<IDBDatabase>((resolve, reject): void => {
      const request: IDBOpenDBRequest = indexedDB.open(trackDbNameConst, trackDbVersionConst);

      request.onupgradeneeded = (): void => {
        const db: IDBDatabase = request.result;
        if (!db.objectStoreNames.contains(trackPointsStoreNameConst)) {
          db.createObjectStore(trackPointsStoreNameConst, { keyPath: 'id' });
        }
      };

      request.onsuccess = (): void => resolve(request.result);
      request.onerror = (): void => reject(request.error);
    });

    return this._dbPromise;
  }

  public async addPoint(point: TrackPointInterface): Promise<void> {
    const db: IDBDatabase = await this._openDb();

    return new Promise<void>((resolve, reject): void => {
      const transaction: IDBTransaction = db.transaction(trackPointsStoreNameConst, 'readwrite');
      transaction.objectStore(trackPointsStoreNameConst).put(point);
      transaction.oncomplete = (): void => resolve();
      transaction.onerror = (): void => reject(transaction.error);
    });
  }

  public async getAllPoints(): Promise<TrackPointInterface[]> {
    const db: IDBDatabase = await this._openDb();

    return new Promise<TrackPointInterface[]>((resolve, reject): void => {
      const transaction: IDBTransaction = db.transaction(trackPointsStoreNameConst, 'readonly');
      const request: IDBRequest<TrackPointInterface[]> = transaction
        .objectStore(trackPointsStoreNameConst)
        .getAll();

      request.onsuccess = (): void => resolve(request.result);
      request.onerror = (): void => reject(request.error);
    });
  }
}
