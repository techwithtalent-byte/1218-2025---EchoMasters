
import { COURSE_MODULES } from '../constants';
import { SearchIndexItem } from '../hooks/useSearch';
import { DemoId } from '../types';

const generateSearchIndex = (): SearchIndexItem[] => {
    return COURSE_MODULES.map(module => ({
        id: module.id as DemoId,
        title: module.title,
        icon: module.icon,
        content: [module.title, module.description, ...module.features].join(' '),
    }));
};

export const searchIndex = generateSearchIndex();
