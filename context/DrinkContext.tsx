import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Drink {
  id: string;
  name: string;
  description: string;
  emojis: string[];
  createdAt: number;
}

interface DrinkContextType {
  drinks: Drink[];
  addDrink: (drink: Omit<Drink, 'id' | 'createdAt'>) => void;
  deleteDrink: (id: string) => void;
  updateDrink: (id: string, drink: Partial<Drink>) => void;
}

const DrinkContext = createContext<DrinkContextType | undefined>(undefined);

export function DrinkProvider({ children }: { children: ReactNode }) {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  const addDrink = (drink: Omit<Drink, 'id' | 'createdAt'>) => {
    const newDrink: Drink = {
      ...drink,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
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

  return (
    <DrinkContext.Provider value={{ drinks, addDrink, deleteDrink, updateDrink }}>
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
