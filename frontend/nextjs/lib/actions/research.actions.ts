'use server'
import { IResearchHistoryItemBase } from '@/types'
import { ResearchHistoryItemSchema } from '../validator'
import { connectToDatabase } from '../db'
import ResearchHistoryItem, {IResearchHistoryItem} from '../db/models/research.model'
import { formatError } from '../utils'

import { auth } from '@/auth'

export type CreateResearchItemResponse =
  | { success: true; data: IResearchHistoryItem }
  | { success: false; message: string };

export async function createResearchItem(
  researchHistoryItem: IResearchHistoryItemBase
): Promise<CreateResearchItemResponse> {


  try {
    // Validate the input with the Zod schema
    const research = await ResearchHistoryItemSchema.parseAsync({
      question: researchHistoryItem.question,
      answer: researchHistoryItem.answer,
      orderedData: researchHistoryItem.orderedData,
    });


    await connectToDatabase();

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    // Use the user id from the session
    const userId = session.user.id;

    const createdResearchItem = await ResearchHistoryItem.create({
      user: userId,
      question: research.question,
      answer: research.answer,
      orderedData: research.orderedData,
    });

    return { success: true, data: createdResearchItem };
  } catch (error) {
    console.log(error)
    return { success: false, message: formatError(error) };
  }
}

// GET
export async function getAllResearchHistory(): Promise<
  | { success: true; data: IResearchHistoryItem[] }
  | { success: false; message: string }
> {
  try {
    await connectToDatabase();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const researchItems = await ResearchHistoryItem.find({
      user: session.user.id,
    }).sort({ createdAt: 'desc' });

    // Convert documents to plain objects if needed
    const data = JSON.parse(JSON.stringify(researchItems));

    return { success: true, data };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getOneResearchItem(id: string): Promise<{ success: boolean; data: IResearchHistoryItem | null; message?: string }> {
  try {
    await connectToDatabase();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const researchItem = await ResearchHistoryItem.findOne({
      user: session.user.id,
      _id: id,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(researchItem)),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: formatError(error),
    };
  }
}


// DELETE
export async function deleteResearchItem(id: string): Promise<{ success: boolean; data?: IResearchHistoryItem | null; message?: string }> {
  try {
    await connectToDatabase();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    // Delete the research item for the authenticated user
    const deletedItem = await ResearchHistoryItem.findOneAndDelete({
      user: session.user.id,
      _id: id,
    });

    return { 
      success: true, 
      data: deletedItem ? JSON.parse(JSON.stringify(deletedItem)) : null 
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
