import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Content, ContentFormData, ContentType, Tag } from '../types';
import { contentAPI, tagsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Define content context state type
interface ContentState {
  contents: Content[];
  filteredContents: Content[];
  tags: Tag[];
  activeFilters: {
    contentType: ContentType | null;
    tags: string[];
    searchQuery: string;
  };
  isLoading: boolean;
  error: string | null;
}

// Define content context type
interface ContentContextType {
  state: ContentState;
  fetchContents: () => Promise<void>;
  fetchTags: () => Promise<void>;
  addContent: (content: ContentFormData) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  filterByType: (type: ContentType | null) => void;
  filterByTags: (tagIds: string[]) => void;
  searchContents: (query: string) => void;
  clearFilters: () => void;
}

// Initial content state
const initialState: ContentState = {
  contents: [],
  filteredContents: [],
  tags: [],
  activeFilters: {
    contentType: null,
    tags: [],
    searchQuery: '',
  },
  isLoading: false,
  error: null,
};

// Create context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Content reducer
type ContentAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Content[] }
  | { type: 'FETCH_TAGS_SUCCESS'; payload: Tag[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'ADD_CONTENT_SUCCESS'; payload: Content }
  | { type: 'DELETE_CONTENT_SUCCESS'; payload: string }
  | { type: 'FILTER_BY_TYPE'; payload: ContentType | null }
  | { type: 'FILTER_BY_TAGS'; payload: string[] }
  | { type: 'SEARCH_CONTENTS'; payload: string }
  | { type: 'APPLY_FILTERS' }
  | { type: 'CLEAR_FILTERS' };

const contentReducer = (state: ContentState, action: ContentAction): ContentState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        contents: action.payload,
        filteredContents: action.payload,
        error: null,
      };
    case 'FETCH_TAGS_SUCCESS':
      return {
        ...state,
        tags: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'ADD_CONTENT_SUCCESS':
      return {
        ...state,
        contents: [action.payload, ...state.contents],
        filteredContents: [action.payload, ...state.filteredContents],
      };
    case 'DELETE_CONTENT_SUCCESS':
      return {
        ...state,
        contents: state.contents.filter((content) => content._id !== action.payload),
        filteredContents: state.filteredContents.filter(
          (content) => content._id !== action.payload
        ),
      };
    case 'FILTER_BY_TYPE':
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          contentType: action.payload,
        },
      };
    case 'FILTER_BY_TAGS':
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          tags: action.payload,
        },
      };
    case 'SEARCH_CONTENTS':
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          searchQuery: action.payload,
        },
      };
    case 'APPLY_FILTERS': {
      const { contentType, tags, searchQuery } = state.activeFilters;
      
      let filtered = [...state.contents];
      
      // Filter by content type
      if (contentType) {
        filtered = filtered.filter((content) => content.type === contentType);
      }
      
      // Filter by tags
      if (tags.length > 0) {
        filtered = filtered.filter((content) =>
          content.tags.some((tag) => tags.includes(tag._id))
        );
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (content) =>
            content.title.toLowerCase().includes(query) ||
            (content.body && content.body.toLowerCase().includes(query))
        );
      }
      
      return {
        ...state,
        filteredContents: filtered,
      };
    }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        activeFilters: {
          contentType: null,
          tags: [],
          searchQuery: '',
        },
        filteredContents: state.contents,
      };
    default:
      return state;
  }
};

// Content provider component
export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(contentReducer, initialState);
  const { state: authState } = useAuth();

  // Apply filters whenever activeFilters change
  useEffect(() => {
    dispatch({ type: 'APPLY_FILTERS' });
  }, [state.activeFilters]);

  // Fetch contents when authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchContents();
      fetchTags();
    }
  }, [authState.isAuthenticated]);

  // Fetch all contents
  const fetchContents = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await contentAPI.getAll();
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch contents';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getAll();
      dispatch({ type: 'FETCH_TAGS_SUCCESS', payload: response.data.tags });
    } catch (error: any) {
      toast.error('Failed to fetch tags');
    }
  };

  // Add new content
  const addContent = async (contentData: ContentFormData) => {
    try {
      console.log('Adding content with payload:', contentData);
      const response = await contentAPI.create(contentData);
      dispatch({ type: 'ADD_CONTENT_SUCCESS', payload: response.data });
      toast.success('Content added successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add content';
      toast.error(errorMessage);
    }
  };

  // Delete content
  const deleteContent = async (id: string) => {
    try {
      await contentAPI.delete(id);
      dispatch({ type: 'DELETE_CONTENT_SUCCESS', payload: id });
      toast.success('Content deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete content';
      toast.error(errorMessage);
    }
  };

  // Filter by content type
  const filterByType = (type: ContentType | null) => {
    dispatch({ type: 'FILTER_BY_TYPE', payload: type });
  };

  // Filter by tags
  const filterByTags = (tagIds: string[]) => {
    dispatch({ type: 'FILTER_BY_TAGS', payload: tagIds });
  };

  // Search contents
  const searchContents = (query: string) => {
    dispatch({ type: 'SEARCH_CONTENTS', payload: query });
  };

  // Clear all filters
  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  return (
    <ContentContext.Provider
      value={{
        state,
        fetchContents,
        fetchTags,
        addContent,
        deleteContent,
        filterByType,
        filterByTags,
        searchContents,
        clearFilters,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

// Custom hook to use content context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};