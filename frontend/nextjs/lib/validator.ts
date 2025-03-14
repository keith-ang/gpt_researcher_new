import { z } from 'zod'

const MongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ID' })

// USER
const UserName = z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username must be at most 30 characters' })
const Email = z.string().min(1, 'Email is required').email('Email is invalid')
const Password = z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
const UserOrganisation = z.string().min(1, 'Organisation is required')


export const UserUpdateSchema = z.object({
    _id: MongoId,
    name: UserName,
    email: Email,
    organisation: UserOrganisation,
  })

export const UserInputSchema = z.object({
    name: UserName,
    email: Email,
    organisation: UserOrganisation,
    password: Password,
  })

export const UserSignInSchema = z.object({
    email: Email,
    password: Password,
})

export const UserSignUpSchema = UserSignInSchema.extend({
        name: UserName,
        confirmPassword: Password,
        organisation: UserOrganisation,
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

export const UserNameSchema = z.object({
    name: UserName,
})



// RESEARCH HISTORY


// Define schemas for each type of Data

const Question = z.string();
const Answer = z.string();
const OrderedData = z.array(z.any()).default([]);

export const ResearchHistoryItemSchema = z.object({
    question: Question,
    answer: Answer,
    orderedData: OrderedData,
});

