import {
    UserInputSchema,
    UserNameSchema,
    UserSignInSchema,
    UserSignUpSchema,
    ResearchHistoryItemSchema
} from "@/lib/validator"
import {z} from "zod"

// user
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>
export type IResearchHistoryItemBase = z.infer<typeof ResearchHistoryItemSchema>