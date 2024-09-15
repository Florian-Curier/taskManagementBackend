import mongoose, { Document } from 'mongoose'
export interface ITask extends Document {
    _id: string;
    title: string;
    UserId: string;
    description?: string
    completed?: boolean;
    category: string;
    priority: 'haute' | 'moyenne' | 'basse';
    dueDate: string;
}

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    UserId: { type: String, required: true},
    description: { type: String},
    completed: { type: Boolean, default: false },
    priority: {type: String, enum: ['haute', 'moyenne', 'basse'], required: true},
    dueDate: { type: Date, required: false}
})

export const Task = mongoose.model<ITask>('Task', taskSchema)