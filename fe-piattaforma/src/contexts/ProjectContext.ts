import { createContext } from 'react';
import { ProjectInfo } from '../models/ProjectInfo.model';

export const ProjectContext = createContext<ProjectInfo | undefined>(undefined);
