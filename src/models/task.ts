import mongoose, { Document } from 'mongoose'

export interface ITask extends Document {
    _id: string;
    title: string;
    UserId: string;
    description?: string
    completed?: boolean;
}

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    UserId: { type: String, required: true},
    description: { type: String},
    completed: { type: Boolean, default: false },
})

export const Task = mongoose.model<ITask>('Task', taskSchema)