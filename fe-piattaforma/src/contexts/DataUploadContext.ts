import { createContext } from 'react';
import { DataUploadContextModel } from '../models/DataUploadContext.model';

export const DataUploadContext = createContext<
  DataUploadContextModel | undefined
>(undefined);
