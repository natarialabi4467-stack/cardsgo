import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Drink {
  id: string;
  name: string;
  description: string;
  emojis: string[];
  createdAt: number;
  ingredients?: IngredientSelection[];
}

export interface IngredientSelection {
  emoji: string;
  quantity: number | '∞';
  category: 'base' | 'flavors' | 'ice' | 'garnish';
}

export interface MixingState {
  step: 1 | 2 | 3 | 4;
  base: IngredientSelection[];
  flavors: IngredientSelection[];
  ice: IngredientSelection[];
  garnish: IngredientSelection[];
}

interface DrinkContextType {
  drinks: Drink[];
  isFirstTime: boolean;
  mixingState: MixingState;
  addDrink: (drink: Omit<Drink, 'id' | 'createdAt'>) => void;
  deleteDrink: (id: string) => void;
  updateDrink: (id: string, drink: Partial<Drink>) => void;
  updateMixingState: (updates: Partial<MixingState>) => void;
  resetMixingState: () => void;
  setIsFirstTime: (value: boolean) => void;
}

const DrinkContext = createContext<DrinkContextType | undefined>(undefined);

export function DrinkProvider({ children }: { children: ReactNode }) {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isFirstTime, setIsFirstTimeState] = useState(true);
  const [mixingState, setMixingState] = useState<MixingState>({
    step: 1,
    base: [],
    flavors: [],
    ice: [],
    garnish: [],
  });

  useEffect(() => {
    // Check if user has drinks to determine if it's first time
    setIsFirstTimeState(drinks.length === 0);
  }, [drinks]);

  const addDrink = (drink: Omit<Drink, 'id' | 'createdAt'>) => {
    const newDrink: Drink = {
      ...drink,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
      ingredients: [
        ...mixingState.base,
        ...mixingState.flavors,
        ...mixingState.ice,
        ...mixingState.garnish,
      ],
    };
    setDrinks((prev) => [newDrink, ...prev]);
  };

  const deleteDrink = (id: string) => {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDrink = (id: string, updatedFields: Partial<Drink>) => {
    setDrinks((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );
  };

  const updateMixingState = (updates: Partial<MixingState>) => {
    setMixingState((prev) => ({ ...prev, ...updates }));
  };

  const resetMixingState = () => {
    setMixingState({
      step: 1,
      base: [],
      flavors: [],
      ice: [],
      garnish: [],
    });
  };

  const setIsFirstTime = (value: boolean) => {
    setIsFirstTimeState(value);
  };

  return (
    <DrinkContext.Provider
      value={{
        drinks,
        isFirstTime,
        mixingState,
        addDrink,
        deleteDrink,
        updateDrink,
        updateMixingState,
        resetMixingState,
        setIsFirstTime,
      }}
    >
      {children}
    </DrinkContext.Provider>
  );
}

export function useDrinks() {
  const context = useContext(DrinkContext);
  if (context === undefined) {
    throw new Error('useDrinks must be used within a DrinkProvider');
  }
  return context;
}
