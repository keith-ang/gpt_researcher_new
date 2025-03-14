// hooks/useResearchHistory.tsx
import { useState, useEffect } from 'react';
import { IResearchHistoryItem } from '@/lib/db/models/research.model';
import {  IResearchHistoryItemBase } from '@/types';
import { Data } from '../types/data';

export const useResearchHistory = () => {
  const [history, setHistory] = useState<IResearchHistoryItem[]>([]);
  
  // Load history from database on initial render
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/researchHistory');
        const json = await res.json();
        if (json.success) {
          setHistory(json.data);
        } else {
          console.error('Error fetching research history:', json.message);
        }
      } catch (error) {
        console.error('Error fetching research history:', error);
      }
    };
    fetchHistory();
  }, []);

  // Save research to history by calling your server action
  const saveResearch = async (question: string, answer: string, orderedData: Data[]) => {
    try {
      const payload: IResearchHistoryItemBase = { question, answer, orderedData };
      const res = await fetch('/api/researchHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setHistory(prev => [json.data, ...prev]);
        // assuming your DB returns _id as the unique identifier; 
        // if you are mapping _id to id elsewhere, adjust accordingly.
        return json.data._id;
      } else {
        console.error('Error saving research item:', json.message);
        return null;
      }
    } catch (error) {
      console.error('Error saving research:', error);
      return null;
    }
  };

  // Get a specific research item by ID
  const getResearchById = async (id: string) => {
    try {
      const res = await fetch(`/api/researchHistory?id=${id}`);
      const json = await res.json();
      if (json.success) {
        return json.data;
      } else {
        console.error('Error retrieving research item:', json.message);
      }
    } catch (error) {
      console.error('Error retrieving research by id:', error);
    }
    return null;
  };

  // Delete a research item
  const deleteResearch = async (id: string) => {
    try {
      const res = await fetch(`/api/researchHistory?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setHistory(prev => prev.filter(item => item.id !== id && item._id !== id));
      } else {
        console.error('Error deleting research item:', json.message);
      }
    } catch (error) {
      console.error('Error deleting research:', error);
    }
  };

  // Optionally, clear all history by deleting each item
  const clearHistory = async () => {
    for (const item of history) {
      // This assumes item.id or item._id holds the identifier
      await deleteResearch(item.id || item._id);
    }
    setHistory([]);
  };

  return {
    history,
    saveResearch,
    getResearchById,
    deleteResearch,
    clearHistory,
  };
};

