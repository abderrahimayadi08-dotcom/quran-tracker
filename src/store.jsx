import { createContext, useContext, useReducer, useEffect } from 'react';

const Ctx = createContext();

const STORAGE_KEY = 'quran-tracker';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        readings: parsed.readings || {},
        settings: parsed.settings || { targetHizb: 4 }
      };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { readings: {}, settings: { targetHizb: 4 } };
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
    alert('حدث خطأ أثناء حفظ البيانات. تأكد من أن مساحة التخزين غير ممتلئة.');
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_READING': {
      const newState = {
        ...state,
        readings: { ...state.readings, [action.date]: action.data }
      };
      save(newState);
      return newState;
    }
    case 'DELETE_READING': {
      const readings = { ...state.readings };
      delete readings[action.date];
      const newState = { ...state, readings };
      save(newState);
      return newState;
    }
    case 'SET_TARGET': {
      const newState = {
        ...state,
        settings: { ...state.settings, targetHizb: action.targetHizb }
      };
      save(newState);
      return newState;
    }
    case 'IMPORT_DATA': {
      const newState = {
        readings: action.data.readings || {},
        settings: action.data.settings || { targetHizb: 4 }
      };
      save(newState);
      return newState;
    }
    default:
      return state;
  }
}

export function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  return (
    <Ctx.Provider value={{ state, dispatch }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  return useContext(Ctx);
}
