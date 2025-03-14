import { IResearchHistoryItemBase } from "@/types";
import {
    Document, Model, model, models, Schema, Types, SchemaDefinitionProperty
} from "mongoose"


export interface IResearchHistoryItem extends Document, IResearchHistoryItemBase {
    _id: string;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const researchHistorySchema = new Schema<IResearchHistoryItem>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      question: { type: String, required: true },
      answer: { type: String, required: true },
      orderedData: ({
        type: [Schema.Types.Mixed],
        required: true,
        default: [],
      } as unknown) as SchemaDefinitionProperty<any[]>,
    },    
    {
      timestamps: true, 
    }
);
  
const ResearchHistoryItem: Model<IResearchHistoryItem> =
    (models.ResearchHistoryItem as Model<IResearchHistoryItem>) ||
    model<IResearchHistoryItem>('ResearchHistoryItem', researchHistorySchema);


export default ResearchHistoryItem